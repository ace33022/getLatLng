/**
 *
 * Get Latitude and Longitude on map
 *
 * @description
 *
 * @version 2018/09/06 初始版本。
 *
 * @author ace
 *
 * @see <a href="http://requirejs.org/">RequireJS</a>
 *
 * @see <a href="https://jquery.com/">jQuery</a>
 *
 * @see <a href="http://underscorejs.org/">Underscore.js</a>
 * @see <a href="https://github.com/jashkenas/underscore">jashkenas/underscore: JavaScript's utility _ belt</a>
 * @see <a href="http://backbonejs.org/">Backbone.js</a>
 * @see <a href="https://github.com/jashkenas/backbone">jashkenas/backbone: Give your JS App some Backbone with Models, Views, Collections, and Events</a>
 * @see <a href="https://github.com/jashkenas/backbone/wiki/Tutorials%2C-blog-posts-and-example-sites">Tutorials, blog posts and example sites · jashkenas/backbone Wiki</a>
 *
 * @see <a href="https://getbootstrap.com/">Bootstrap · The most popular HTML, CSS, and JS library in the world.</a>
 *
 * @comment
 *
 * @todo
 *
 */

Configurations.loadJS(Configurations.requirejsFile, function() {

	requirejs.config(tw.ace33022.RequireJSConfig);

	requirejs(["tw.ace33022.util.DateTimeUtils", "tw.ace33022.util.browser.FormUtils", "tw.ace33022.util.browser.ReUtils", "leaflet.EasyButton"], function(DateTimeUtils, FormUtils, ReUtils) {

		jQuery(document).ready(function() {

			function setMarker() {
			
				// layerGroup.removeLayer(marker);
				
				marker.setLatLng(L.latLng('', ''));
				
				if (jQuery.isNumeric(jQuery('#' + inpLatId).val()) && jQuery.isNumeric(jQuery('#' + inpLngId).val())) {
				
					marker.setLatLng(L.latLng(jQuery('#' + inpLatId).val(), jQuery('#' + inpLngId).val()));

					baseMap.setView([jQuery('#' + inpLatId).val(), jQuery('#' + inpLngId).val()], 15);
				}
			}

			// 這個寫法只有在轉換瀏覽器的Tab時才有作用，轉換不同程式時則無用！？
			document.addEventListener('visibilitychange',

				function() {

					// if (!document.hidden) initInsertStatus(false);
					// console.log(document.visibilityState);
				},
				false
			);
		
			jQuery(window).on('focus', function(event) { jQuery('#' + inpAddressId).select().focus(); });
			
			var inpAddressId = 'inpAddress' + Math.random().toString(36).substr(2, 6);
			var inpLatId = 'inpLat' + Math.random().toString(36).substr(2, 6);
			var inpLngId = 'inpLng' + Math.random().toString(36).substr(2, 6);
			var btnFindId = 'btnFind' + Math.random().toString(36).substr(2, 6);
			var mapId = 'map' + Math.random().toString(36).substr(2, 6);

			var container = jQuery('<div class="container"></div>');
			var tag;

			var baseMap;
			var baseLayerGroup = new L.layerGroup();
			var divIcon = L.divIcon({"iconSize": L.point(25, 25), "className": "leaflet-div-icon-add-event"});
			var marker = null;

			tag = '<div class="row" style="margin-top: 5px; margin-bottom: 10px;">'
					+ '  <div class="col-md-6" style="margin-top: 5px; margin-bottom: 10px;">'
					+ '    <div id="' + mapId + '" style="height: 350px;" tabindex="-1"></div>'
					+ '  </div>'
			    + '  <div class="col-md-6" style="margin-top: 5px; margin-bottom: 10px;">'
					+ '    <form role="form">'
					+ '      <div class="well">'
					+ '      <label for="' + inpAddressId + '" class="control-label">Address</label>'
					+ '      <div class="input-group">'
					+ '        <input type="text" id="' + inpAddressId + '" class="form-control" tabindex="0" placeholder="Taipei 101" />'
					+ '        <span class="input-group-btn"><input type="button" id="' + btnFindId + '" class="btn btn-primary pull-right" value="Find" /></span>'
					+ '		   </div>'
					+ '      </div>'
					+ '    </form>'
					+ '    <div class="row" style="margin-top: 5px;">'
					+ '		   <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>'
					+ '      <!-- ToolGroup -->'
					+ '      <ins class="adsbygoogle" style="display:block;" data-ad-client="ca-pub-2244483882494685"	data-ad-slot="7390066670"	data-ad-format="auto" data-full-width-responsive="true"></ins>'
					+ '      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>'
					+ '    </div>'
					+ '    <div class="row">'
					+ '      <div class="col-md-6">'
					+ '        <label for="' + inpLatId + '" class="control-label">Latitude</label>'
					+ '        <input type="text" id="' + inpLatId + '" class="form-control" tabindex="0" readonly />'
					+ '      </div>'
					+ '      <div class="col-md-6">'
					+ '        <label for="' + inpLngId + '" class="control-label">Longitude</label>'
					+ '        <input type="text" id="' + inpLngId + '" class="form-control" tabindex="0" readonly />'
					+ '      </div>'
					+ '    </div>'
					+ '  </div>'
					+ '</div>';
			container.append(tag).appendTo('body');

			baseMap = L.map(mapId);

			// set map tiles source
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {

					// attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
					maxZoom: 18
				}
			).addTo(baseMap);

			baseLayerGroup.addTo(baseMap);

			jQuery('#' + inpAddressId).on('keypress', function(event) {

				if (event.keyCode == 13) return false;
			});
			
			jQuery('#' + btnFindId).on('click', function(event) {

				if (jQuery('#' + inpAddressId).val() != '') {

					FormUtils.showProgressbar(
					
						'Processing‧‧‧',
						function(closeProgressbar) {
						
							var searchUrl = 'https://script.google.com/macros/s/AKfycbxNr_AMxteL0Oyf--G1Uu5fL2gT1xVRyv1bCy-9-g/exec?address=' + jQuery('#' + inpAddressId).val();
						
							jQuery.getJSON(searchUrl, function(data) {

								if (data["error_code"] == 0) {

									jQuery('#' + inpLatId).val(data["data"]["latitude"]);
									jQuery('#' + inpLngId).val(data["data"]["longitude"]);
									
									setMarker();
									
									closeProgressbar();
								}
							});
						}
					);
				}
			});
			
			// Taipei 101
			jQuery('#' + inpLatId).val(25.0340);
			jQuery('#' + inpLngId).val(121.5645);

			marker = L.marker([], {"icon": divIcon, "draggable": true}).addTo(baseLayerGroup);

			marker.on('dragend', function() {

				jQuery('#' + inpLatId).val(marker.getLatLng()["lat"]);
				jQuery('#' + inpLngId).val(marker.getLatLng()["lng"]);
			});
			
			setMarker();
			
			jQuery('#' + inpAddressId).select().focus();
		});	// document ready
	});
});