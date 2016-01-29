(function() {
    angular.module('users')
        .directive("experiment", directiveFunction)
})();

var spectrometer_stage, spectrometer_container, grating_spectrometer_container, spectrometer_top_view_container;

var focus_object_mask, slit_mask, scale_mask, slit_pointer_1, slit_pointer_2;

var switch_on_btn_label, switch_off_btn_label, place_grating_btn_label, remove_grating_btn_label;

var vernier1_text, vernier2_text, tick, color_slit, hit_flag;

var slit_center_x, telescope_fine_angle, vernier_fine_angle, diffraction_angle=[];

function directiveFunction() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            /** Variable that decides if something should be drawn on mouse move */
            var experiment = true;
            if (element[0].width > element[0].height) {
                element[0].width = element[0].height;
                element[0].height = element[0].height;
            } else {
                element[0].width = element[0].width;
                element[0].height = element[0].width;
            }
            if (element[0].offsetWidth > element[0].offsetHeight) {
                element[0].offsetWidth = element[0].offsetHeight;
            } else {
                element[0].offsetWidth = element[0].offsetWidth;
                element[0].offsetHeight = element[0].offsetWidth;
            }
            /** Load images */
            queue = new createjs.LoadQueue(true);
            queue.installPlugin(createjs.Sound);
            queue.on("complete", handleComplete, this);
            queue.loadManifest([{/** Spectrometer side view background */
                id: "background_side_view",
                src: "././images/background_side_view.svg",
                type: createjs.LoadQueue.IMAGE
            },{/** Spectrometer top view background  */ 
                id: "background_top_view",
                src: "././images/background_top_view.svg",
                type: createjs.LoadQueue.IMAGE
            },{/**  Focus object */
                id: "focus_object",
                src: "././images/focus_object.svg",
                type: createjs.LoadQueue.IMAGE
            },{/**  Telescope */
                id: "telescope",
                src: "././images/telescope.svg",
                type: createjs.LoadQueue.IMAGE
            },{/**  Telescope under table*/
                id: "telescope_under",
                src: "././images/telescope_under.svg",
                type: createjs.LoadQueue.IMAGE
            },{/**  Main scale  */
                id: "main_scale",
                src: "././images/main_scale.svg",
                type: createjs.LoadQueue.IMAGE
            },{/**  Grating */
                id: "grating",
                src: "././images/grating.svg",
                type: createjs.LoadQueue.IMAGE
            },{/**  Grating hanger*/
                id: "grating_hanger",
                src: "././images/grating_hanger.svg",
                type: createjs.LoadQueue.IMAGE
            },{/**  Collimator */
                id: "collimator",
                src: "././images/collimator.svg",
                type: createjs.LoadQueue.IMAGE
            },{/**  Collimator under table*/
                id: "collimator_under",
                src: "././images/collimator_under.svg",
                type: createjs.LoadQueue.IMAGE
            },{/**  Vernier scale */
                id: "vernier_scale",
                src: "././images/vernier_scale.svg",
                type: createjs.LoadQueue.IMAGE
            },{/**  Vernier table*/
                id: "vernier_table",
                src: "././images/vernier_table.svg",
                type: createjs.LoadQueue.IMAGE
            },{/**  Light source */
                id: "light",
                src: "././images/white_light.svg",
                type: createjs.LoadQueue.IMAGE
            },{/** White slit */
                id: "white_slit",
                src: "././images/white_slit.svg",
                type: createjs.LoadQueue.IMAGE
            },{/** Yellow slit */
                id: "yellow_slit",
                src: "././images/yellow_slit.svg",
                type: createjs.LoadQueue.IMAGE
            },{/** Yellow light slit */
                id: "yellow_light_slit",
                src: "././images/yellow_light_slit.svg",
                type: createjs.LoadQueue.IMAGE
            },{/** Green slit */
                id: "green_slit",
                src: "././images/green_slit.svg",
                type: createjs.LoadQueue.IMAGE
            },{/** Blue green slit */
                id: "blue_green_slit",
                src: "././images/blue_green_slit.svg",
                type: createjs.LoadQueue.IMAGE
            },{/** Pink  slit */
                id: "pink_slit",
                src: "././images/pink_slit.svg",
                type: createjs.LoadQueue.IMAGE
            },{/** Violet light slit */
                id: "violet_light_slit",
                src: "././images/violet_light_slit.svg",
                type: createjs.LoadQueue.IMAGE
            },{/** Violet  slit */
                id: "violet_slit",
                src: "././images/violet_slit.svg",
                type: createjs.LoadQueue.IMAGE
            },{/** Cross wire */
                id: "cross_wire",
                src: "././images/cross_wire.svg",
                type: createjs.LoadQueue.IMAGE
            },{/** Grating table */
                id: "grating_table",
                src: "././images/grating_table.svg",
                type: createjs.LoadQueue.IMAGE
            }         
            ]);
            /** Stage creation */
            spectrometer_stage = new createjs.Stage("demoCanvas");
            spectrometer_stage.enableDOMEvents(true);
            spectrometer_stage.enableMouseOver();
            createjs.Touch.enable(spectrometer_stage);
            /** Stage creation */            
            focus_telescope_container = new createjs.Container(); /** Focus telescope container*/
            spectrometer_stage.addChild(focus_telescope_container); /** Add it in to the stage */              
            grating_spectrometer_container= new createjs.Container(); /** Grating spectrometer container*/           
            spectrometer_stage.addChild(grating_spectrometer_container); /** Add it in to the stage */  
            spectrometer_top_view_container= new createjs.Container(); /** Spectrometer top view container */
            spectrometer_stage.addChild(spectrometer_top_view_container); /** Add it in to the stage */             
            zoom_container= new createjs.Container(); /** Spectrometer top view container */
            spectrometer_stage.addChild(zoom_container); /** Add it in to the stage */ 
            /** For different shapes */
            focus_object_mask = new createjs.Shape();/** Focus object mask */
            slit_mask= new createjs.Shape();/** Slit mask */
            vernier_scale_1_mask= new createjs.Shape();/** Zoom scale mask */
            vernier_scale_2_mask= new createjs.Shape();/** Zoom scale mask */
            slit_pointer_1= new createjs.Shape();/** For dashed lines */
            slit_pointer_2= new createjs.Shape();/** For dashed lines */
            function handleComplete() {
                initialisationOfVariables(); /** Initializing the variables */
                translationLabels(); /** Translation of strings using gettext */ 
                /** Load images */
                loadImages(queue.getResult("background_side_view"), "background_side_view", 0, 0, "", 1, 1, focus_telescope_container); /** Spectrometer side view background  */ 
                loadImages(queue.getResult("background_top_view"), "background_top_view", 0, 0, "", 1, 1, grating_spectrometer_container); /** Spectrometer top view background  */  
                loadImages(queue.getResult("telescope_under"), "telescope_under", 289, 438, "", 1.4, 1, spectrometer_top_view_container); /** Telescope under table  */  
                loadImages(queue.getResult("collimator_under"), "collimator_under", 260, 290, "", 1.1, 1, spectrometer_top_view_container); /** Collimator under table   */  
                loadImages(queue.getResult("main_scale"), "main_scale",289, 438 , "", 0.154, 1, spectrometer_top_view_container); /** Main scale  */  
                loadImages(queue.getResult("vernier_scale"), "vernier_scale", 290, 438, "", 0.154, 1, spectrometer_top_view_container); /** Vernier scale  */  
                loadImages(queue.getResult("vernier_table"), "vernier_table", 289, 438, "", 1.1, 1, spectrometer_top_view_container); /** Vernier table  */  
                loadImages(queue.getResult("grating_table"), "grating_table", 289, 438, "", 1.1, 1, spectrometer_top_view_container); /** Vernier table  */  
                loadImages(queue.getResult("telescope"), "telescope", 289, 438 , "", 1.4, 1, spectrometer_top_view_container); /** Telescope  */  
                loadImages(queue.getResult("collimator"), "collimator", 282, 405, "", 1.4, 1, spectrometer_top_view_container); /** Collimator */  
                loadImages(queue.getResult("grating"), "grating", 289, 438, "", 1.1, 0, spectrometer_top_view_container); /** Grating  */  
                loadImages(queue.getResult("grating_hanger"), "grating_hanger", 289, 438, "", 1.1, 1, spectrometer_top_view_container); /** Grating hanger */  
                loadImages(queue.getResult("light"), "light", 585, 380, "", 1, 0, spectrometer_top_view_container); /** Light  */ 
                loadImages(queue.getResult("main_scale"), "main_2_scale_zoom", 573 , 1420, "", -1.3 , 1, zoom_container); /** Main scale zoom  */  
                loadImages(queue.getResult("vernier_scale"), "vernier_2_scale_zoom",  571 , 1415, "", 1.3, 1, zoom_container); /** Vernier scale zoom  */  
                loadImages(queue.getResult("main_scale"), "main_1_scale_zoom",  320, 910, "", 1.3 , 1, zoom_container); /** Main scale zoom  */  
                loadImages(queue.getResult("vernier_scale"), "vernier_1_scale_zoom", 318, 905 , "", 1.3, 1, zoom_container); /** Vernier scale zoom  */  
                drawRectangle(vernier_scale_1_mask, 206, 12, 226 , 165 , "#CCC" , "" , zoom_container)// Vernier scale 1 mask
                drawRectangle(vernier_scale_2_mask, 457, 523, 226 , 165 , "#CCC" , "" , zoom_container)//  Vernier scale 2 mask
                setText("vernier1_zoom_label", 280, 200, vernier1_text , "white", 1, zoom_container); /** Vernier scale 1 label */
                setText("vernier2_zoom_label", 546, 512, vernier2_text , "white", 1, zoom_container); /** Vernier scale 1 label */
                drawCircle(focus_object_mask, 235, 143, 120,"#CCC",1, focus_telescope_container);// Focus object mask
                drawCircle(slit_mask, 97, 90, 81,"",1, zoom_container);// Slit mask  
                loadImages(queue.getResult("white_slit"), "white_slit_reflection", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** White slit :- Reflection */ 
                loadImages(queue.getResult("white_slit"), "white_slit", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** White slit :- Center */ 
                loadImages(queue.getResult("yellow_slit"), "yellow_first_order_L", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Yellow slit  */ 
                loadImages(queue.getResult("yellow_light_slit"), "yellow_light_first_order_L", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Light yellow  slit  */ 
                loadImages(queue.getResult("green_slit"), "green_first_order_L", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Green slit  */                 
                loadImages(queue.getResult("blue_green_slit"), "blue_green_first_order_L", slit_center_x , 89 , "",2.5 , 0, zoom_container); /** Blue green slit  */
                loadImages(queue.getResult("pink_slit"), "pink_first_order_L", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Pink slit  */ 
                loadImages(queue.getResult("violet_light_slit"), "violet_light_first_order_L", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Light violet slit  */ 
                loadImages(queue.getResult("violet_slit"), "violet_first_order_L", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Violet slit  */             
                loadImages(queue.getResult("yellow_slit"), "yellow_second_order_L", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Yellow slit  */ 
                loadImages(queue.getResult("yellow_light_slit"), "yellow_light_second_order_L", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Light yellow  slit  */ 
                loadImages(queue.getResult("green_slit"), "green_second_order_L", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Green slit  */                 
                loadImages(queue.getResult("blue_green_slit"), "blue_green_second_order_L", slit_center_x , 89 , "",2.5 , 0, zoom_container); /** Blue green slit  */
                loadImages(queue.getResult("pink_slit"), "pink_second_order_L", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Pink slit  */ 
                loadImages(queue.getResult("violet_light_slit"), "violet_light_second_order_L", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Light violet slit  */ 
                loadImages(queue.getResult("violet_slit"), "violet_second_order_L", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Violet slit  */   
                loadImages(queue.getResult("yellow_slit"), "yellow_first_order_R", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Yellow slit  */ 
                loadImages(queue.getResult("yellow_light_slit"), "yellow_light_first_order_R", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Light yellow  slit  */ 
                loadImages(queue.getResult("green_slit"), "green_first_order_R", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Green slit  */                 
                loadImages(queue.getResult("blue_green_slit"), "blue_green_first_order_R", slit_center_x , 89 , "",2.5 , 0, zoom_container); /** Blue green slit  */
                loadImages(queue.getResult("pink_slit"), "pink_first_order_R", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Pink slit  */ 
                loadImages(queue.getResult("violet_light_slit"), "violet_light_first_order_R", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Light violet slit  */ 
                loadImages(queue.getResult("violet_slit"), "violet_first_order_R", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Violet slit  */             
                loadImages(queue.getResult("yellow_slit"), "yellow_second_order_R", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Yellow slit  */ 
                loadImages(queue.getResult("yellow_light_slit"), "yellow_light_second_order_R", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Light yellow  slit  */ 
                loadImages(queue.getResult("green_slit"), "green_second_order_R", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Green slit  */                 
                loadImages(queue.getResult("blue_green_slit"), "blue_green_second_order_R", slit_center_x , 89 , "",2.5 , 0, zoom_container); /** Blue green slit  */
                loadImages(queue.getResult("pink_slit"), "pink_second_order_R", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Pink slit  */ 
                loadImages(queue.getResult("violet_light_slit"), "violet_light_second_order_R", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Light violet slit  */ 
                loadImages(queue.getResult("violet_slit"), "violet_second_order_R", slit_center_x , 89 , "", 2.5 , 0, zoom_container); /** Violet slit  */   
                loadImages(queue.getResult("focus_object"), "focus_object", 50, -50, "", 1, 1, focus_telescope_container); /** Focus object */
                loadImages(queue.getResult("cross_wire"), "cross_wire", 6, 0, "", 1, 1, zoom_container); /** Cross wire  */  
                /** Draw dashed line for pointing to slit  */
                drawDashedLine(slit_pointer_1,spectrometer_top_view_container.getChildByName("telescope").x-160,spectrometer_top_view_container.getChildByName("telescope").y+140,15,88,4,"#FFF",zoom_container); /** Dashed line */
                drawDashedLine(slit_pointer_2,spectrometer_top_view_container.getChildByName("telescope").x-160,spectrometer_top_view_container.getChildByName("telescope").y+140,178,88,4,"#FFF",zoom_container); /** Dashed line */
                loadImages(queue.getResult("telescope"), "drag_telescope", 358, 339 , "pointer", 1.4, 0.01, zoom_container); /** Drag telescope  */  
                zoom_container.getChildByName("drag_telescope").rotation=-45;/** Rotate drag telescope  */
                zoom_container.getChildByName("main_1_scale_zoom").rotation=143;/** Rotate main scale(zoom) */
                zoom_container.getChildByName("main_2_scale_zoom").rotation=143;/** Rotate main scale(zoom)  */
                spectrometer_top_view_container.getChildByName("main_scale").rotation=143;/** Rotate main scale */ 
                zoom_container.getChildByName("vernier_1_scale_zoom").mask=vernier_scale_1_mask;
                zoom_container.getChildByName("main_1_scale_zoom").mask=vernier_scale_1_mask;
                zoom_container.getChildByName("vernier_2_scale_zoom").mask=vernier_scale_2_mask;
                zoom_container.getChildByName("main_2_scale_zoom").mask=vernier_scale_2_mask;
                dragTelescope(scope);/** Drag telescope to adjust the telescope position  */
                /** Createjs stage updation happens */
                spectrometer_stage.update();                
            }  
            /** Draw dashed line  */          
            createjs.Graphics.prototype.dashedLineTo = function( x1 , y1 , x2 , y2 , dashLen ){
                this.moveTo( x1 , y1 );
                dX = x2 - x1;
                dY = y2 - y1;
                dashes = Math.floor(Math.sqrt( dX * dX + dY * dY ) / dashLen );
                dashX = dX / dashes;
                dashY = dY / dashes;
                q = 0;
                while( q++ < dashes ){
                    x1 += dashX;
                    y1 += dashY;
                    this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
                }
                this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
                return this;
            }
            /** Draw circle  */           
            function drawCircle(circle_name,x_pos,y_pos,circle_radius,color,alpha_val,container){
                circle_name.alpha = alpha_val;
                circle_name.graphics.beginStroke(color);
                circle_name.graphics.setStrokeStyle(3);
                circle_name.graphics.beginFill("#000").arc(x_pos, y_pos, circle_radius, 0, 2 * Math.PI); 
                container.addChild(circle_name); /** Add circle into container */
            }
            /** Draw rectangle  */ 
            function drawRectangle(rect_name,x_rect_pos,y_rect_pos,rect_width,rect_height,border_color,fill_color,container){
                rect_name.graphics.beginStroke(border_color);
                rect_name.graphics.setStrokeStyle(2);
                rect_name.graphics.beginFill(fill_color).drawRoundRect(x_rect_pos, y_rect_pos, rect_width,rect_height,20);
                container.addChild(rect_name); /** Add rectangle into container */
            }
            /** All the texts loading and added to the stage */
            function setText(name, textX, textY, value, color, fontSize, container) {
                var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
                _text.x = textX;
                _text.y = textY;
                _text.textBaseline = "alphabetic";
                _text.name = name;
                _text.text = value;
                _text.color = color;
                container.addChild(_text); /** Adding text to the container */
            }
            /** All the images loading and added to the stage */
            function loadImages(image, name, xPos, yPos, cursor, sFactor, alpha, container) {
                var _bitmap = new createjs.Bitmap(image).set({});
                if (name == "focus_object" ) { /** Mask and blur apply on the focus object */
                    var _blur_filter = new createjs.BlurFilter(15, 15, 15); /** Blur value */                    
                    _bitmap.mask = focus_object_mask;
                    _bitmap.filters = [_blur_filter];
                    _bitmap.cache(0, 0, _bitmap.image.width, _bitmap.image.height);
                }else if ( name == "vernier_table" || name == "grating_table" || name == "vernier_scale" || name == "main_scale" || name == "grating" || name == "grating_hanger" || name == "main_1_scale_zoom" || name == "vernier_1_scale_zoom" || name == "main_2_scale_zoom" || name == "vernier_2_scale_zoom" ) { // Set rotation center
                    _bitmap.regX = _bitmap.image.width / 2;
                    _bitmap.regY = _bitmap.image.height / 2;                    
                }else if ( name == "telescope" || name == "telescope_under" || name == "drag_telescope") { // Set rotation center
                    _bitmap.regX = _bitmap.image.width;
                    _bitmap.regY = _bitmap.image.height/2;
                }else{
                     for(var i=0;i<color_slit.length;i++){
                        if (name == color_slit[i] || name=="white_slit" || name=="white_slit_reflection") { /** Mask and blur apply on the slit */
                            var _slit_blur_filter = new createjs.BlurFilter(1, 1, 1); /** Blur value */
                            _bitmap.mask = slit_mask;
                            _bitmap.filters = [_slit_blur_filter];
                            _bitmap.cache(0, 0, _bitmap.image.width, _bitmap.image.height);
                            _bitmap.regX = _bitmap.image.width / 2;
                            _bitmap.regY = _bitmap.image.height / 2;
                        } 
                    }
                }
                _bitmap.x = xPos;
                _bitmap.y = yPos;
                _bitmap.name = name;
                _bitmap.alpha = alpha;
                _bitmap.scaleX = sFactor;
                _bitmap.scaleY = sFactor;
                _bitmap.cursor = cursor;                
                container.addChild(_bitmap); /** Adding bitmap to the container */
            }
            /** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */
            function translationLabels() {
                /** This help array shows the hints for this experiment */
                helpArray = [_("help1"), _("help2"), _("help3"), _("help4"), _("help5"), _("help6"), _("help7"), _("help8"), _("help9"),_("help10"),_("help11"), _("Next"), _("Close")];
                scope.heading = _("Diffraction of mercury light"); /** Experiment title */
                scope.variables = _("Variables"); /** Variable label */
                scope.result = _("Result"); /** Result label */
                scope.copyright = _("copyright"); /** Copyright © Amrita University 2009 - 2015 */               
                scope.reset = _("Reset"); /** 'Reset' button label */
                scope.start_btn_label = _("Start"); /** 'Start' button label */
                scope.telescope_focus_label = _("Focusing of telescope"); /** 'Focusing of telescope'  label */
                switch_on_btn_label = _("Switch on light"); /** 'Switch on light'  label */
                switch_off_btn_label = _("Switch off light"); /** 'Switch on light'  label */
                scope.switch_btn_label = switch_on_btn_label /** 'Switch off light'  label */
                scope.slit_focus_label = _("Slit focus"); /** 'Slit focus'  label */
                scope.slit_width_label = _("Slit width"); /** 'Slit width'  label */
                place_grating_btn_label = _("Place grating");/** 'Place grating/Remove grating' label */
                remove_grating_btn_label = _("Remove grating");/** 'Remove grating'  label  */
                scope.grating_btn_label = place_grating_btn_label; /** 'Place grating'  label */
                scope.change_angle_label = _("Change angle:"); /** 'Change angle'  label */
                scope.telescope_label = _("Telescope"); /** 'Telescope'  label */
                scope.vernier_table_label = _("Vernier table"); /** 'Vernier table'  label */
                scope.grating_table_label= _("Grating table"); /** 'Grating table'  label */
                scope.fine_angle_label = _("Fine angle:"); /** 'Fine angle'  label */  
                vernier1_text = _("Vernier 1"); /** 'Fine angle'  label */  
                vernier2_text = _("Vernier 2"); /** 'Fine angle'  label */               
                scope.$apply();
            } 
            /** All variables initialising in this function */
            function initialisationOfVariables() { 
                color_slit=["yellow_first_order_L","yellow_light_first_order_L","green_first_order_L","blue_green_first_order_L","pink_first_order_L","violet_light_first_order_L","violet_first_order_L","yellow_first_order_R","yellow_light_first_order_R","green_first_order_R","blue_green_first_order_R","pink_first_order_R","violet_light_first_order_R","violet_first_order_R","yellow_second_order_L","yellow_light_second_order_L","green_second_order_L","blue_green_second_order_L","pink_second_order_L","violet_light_second_order_L","violet_second_order_L","yellow_second_order_R","yellow_light_second_order_R","green_second_order_R","blue_green_second_order_R","pink_second_order_R","violet_light_second_order_R","violet_second_order_R"];/** All slit */
                diffraction_angle=[20.33078935,20.25359971,19.12586237,17.15539066,15.15907359,14.16232078,14.05147975,-20.33078935,-20.25359971,-19.12586237,-17.15539066,-15.15907359,-14.16232078,-14.05147975,44.01759179,43.81657963,40.94155193,36.15192741,31.53367467,29.29718464,29.05095132,-44.01759179,-43.81657963,-40.94155193,-36.15192741,-31.53367467,-29.29718464,-29.05095132]
                spectrometer_top_view_container.rotation=-45;/** Container rotate  to 45 degree*/ 
                spectrometer_top_view_container.y=230;/** Container y position change */ 
                spectrometer_top_view_container.x=-150;/** Container x position change */              
                blur_filter = new createjs.BlurFilter(15, 15, 15); /** Blur value */  
                slit_blur_filter = new createjs.BlurFilter(1, 1, 1);/** Blur value */  
                scope.telescope_model=90; /** Initial value of telescope rotate slider */  
                scope.vernier_model=0; /** Initial value of vernier rotate slider */ 
                scope.telescope_fine_model=0;/** Initial value of fine telescope rotate slider */    
                scope.grating_model=0/** Initial value of grating rotate slider */ 
                scope.slit_focus_model=1;/** Initial slit focus */   
                focus_telescope_container.visible=true;/** Container visiblity set to true */
                grating_spectrometer_container.visible=false; /** Container visiblity set to false */                 
                spectrometer_top_view_container.visible=false;/** Container visiblity set to false */
                zoom_container.visible=false;/** Container visiblity set to false */
                hit_flag=false;/** Hit telescope */
                slit_center_x=97; /** Slit center position */
                telescope_fine_angle=0;/** Telescope fine angle */
                vernier_fine_angle=0; /** Vernier fine angle */
     
            }                                
        }
    }
}
/** Drag telescope to adjust the telescope movement */
function dragTelescope(scope) { 
    var  _limit_flag = false;
    var _angle=scope.telescope_model-90;    
    zoom_container.getChildByName("drag_telescope").on("pressmove", function (evt) { /** Drag telescope */
       if(_angle >= -90  &&  _angle <= 90){            
            var _adj = evt.stageX - 365;
            var _opp = evt.stageY - 336;
            _angle = Math.atan2(_opp, _adj); 
            _angle = _angle / (Math.PI / 180)-134;
            _angle=Math.round(_angle*10)/10; 
            if( hit_flag == false){
                if(_angle<-150){                
                    _angle=_angle+360;                
                } 
            }                   
            _angle=Math.round(_angle*10)/10;
            scope.telescope_model=_angle.toFixed(1);   
            scope.$apply();       
            telescopeMove(scope,_angle);
            spectrometer_stage.update();              
        }else{
            _limit_flag = true;                       
        }
    });
   zoom_container.getChildByName("drag_telescope").on("pressup", function (evt) { 
       if(_limit_flag){
            _limit_flag = false;   
            if(_angle > 90){
                _angle = 90; 
                hit_flag=true;               
            }else if(_angle < -90){
                _angle = _angle < -200 ? 90 : -90;
                hit_flag=false;                  
            }else{
                hit_flag=false;
            } 
        } 
        telescopeMove(scope,_angle);
        spectrometer_stage.update(); 
        var _tel_slider_val=90+_angle;
        scope.telescope_model=_tel_slider_val.toFixed(1);                
        scope.$apply(); 
    });
}
/** Function to move telescope  */
function telescopeMove(scope,angle){
    stageUpdate();/** Updating stage to apply tween effect */ 
    zoom_container.getChildByName("drag_telescope").rotation = angle-45;
    spectrometer_top_view_container.getChildByName("telescope").rotation = angle;
    spectrometer_top_view_container.getChildByName("telescope_under").rotation = angle;
    spectrometer_top_view_container.getChildByName("main_scale").rotation=angle; 
    tweenEndFn("telescope",angle); 
    zoomMainScaleRotation(scope);       
    slitMovement(scope); /** Move the slit when the telescope rotate  */         
    spectrometer_stage.update();  
}
/**  Function :- Change focus telescope slider  */
function focusTelescopeFn(scope) {
    /** Apply blur on focus object*/
    var _blur=Math.abs(scope.telescope_focus_model);    
    if(_blur<=2 && _blur>=0){ /** Correct focus*/
        _blur=0;
        scope.start_disabled=false;
    }else{
        scope.start_disabled=true;
    } 
    applyBlurFn("focus_object",_blur,focus_telescope_container);  
    spectrometer_stage.update(); /** Createjs stage updation happens */
}
/** Function :-  Start button click */
function startExperimentFn() {
    grating_spectrometer_container.visible=true;/**To hide focus telescope container */
    spectrometer_top_view_container.visible=true;/**To show top view grating spectrometer container */
    focus_telescope_container.visible=false;/**To show grating spectrometer container */
    zoom_container.visible=true;/**To show zoom container */
    spectrometer_stage.update(); /** Createjs stage updation happens */
}
/** Function :-  Switch on / off  button click*/
function switchOnOrOffFn(scope) { 
    scope.switch_btn_label = scope.switch_on_off ? switch_on_btn_label : switch_off_btn_label;  /** Change label :- 'Switch on/off light' */
    spectrometer_top_view_container.getChildByName("light").alpha = scope.switch_on_off ?  0 : 1 ;  /** 'Switch on/off light' */
    displaySlit(scope);/** Display slit */
    slitMovement(scope); /** Move the slit when the telescope rotate  */    
    spectrometer_stage.update();/** Createjs stage updation happens */
}
/** Function :-  Place grating button click */
function placeGratingFn(scope) {
    scope.grating_btn_label = scope.place_grating ? place_grating_btn_label : remove_grating_btn_label;  /** Change label :- 'Place/Remove grating' */
    spectrometer_top_view_container.getChildByName("grating").alpha = scope.place_grating ?  0 : 1 ;  /** 'Place/Remove grating' */
    displaySlit(scope);/** Display slit */
    slitMovement(scope);/** Move the slit when the telescope rotate  */   
    spectrometer_stage.update();/** Createjs stage updation happens */
}
/** Function :-  To display slit */
function displaySlit(scope){
    if(scope.switch_on_off==false){  
        for(var i=0;i<color_slit.length;i++){         
            if(i<14){/**  Display/Hide first order slit */                
                zoom_container.getChildByName(color_slit[i]).alpha =  scope.place_grating ?  0 : 1;
            }else{ /** Display/Hide second order slit*/
                zoom_container.getChildByName(color_slit[i]).alpha =  scope.place_grating ?  0 : 0.5;
            } 
            zoom_container.getChildByName("white_slit_reflection").alpha =scope.place_grating ?  0 : 1;     /** Show/Hide reflection slit */           
        } 
        zoom_container.getChildByName("white_slit").alpha  = scope.place_grating ?  1 : 0.8;   /** Slit White*/
    }else{ /** Hide slit */
        zoom_container.getChildByName("white_slit").alpha = 0; 
        zoom_container.getChildByName("white_slit_reflection").alpha =0;
        for(var i=0;i<color_slit.length;i++){         
            zoom_container.getChildByName(color_slit[i]).alpha =  0;
        }         
    }
}
/** Function :- Grating rotation*/
function gratingRotateFn(scope) {     
    stageUpdate();
    gratingRotation(scope);/** Grating rotation */     
    slitMovement(scope); /** Move the slit when the telescope rotate  */
}
/** Function :- Telescope rotation*/
function telescopeRotateFn(scope) {     
    telescopeRotation(scope,scope.telescope_model); /** Telescope rotation */ 
}
/** Function :- Vernier table rotation */
function verniertableRotateFn(scope) {
    var _current_fine_angle = scope.vernier_model;  
    var _change_angle = _current_fine_angle - vernier_fine_angle; 
    scope.grating_model=_change_angle+parseFloat(scope.grating_model);
    gratingRotation(scope);     
    verniertableRotation(scope, scope.vernier_model);
    vernier_fine_angle = _current_fine_angle;       
}
/** Function :- Telescope fine rotation */
function telescopeFineRotateFn(scope) {  
     var _current_fine_angle = scope.telescope_fine_model  
     var _change_angle = _current_fine_angle - telescope_fine_angle;     
     if((scope.telescope_model + _change_angle)  <= 180 && (scope.telescope_model + _change_angle)  >= 0 ){
        var _telescope_rotation = scope.telescope_model + _change_angle ;
        _telescope_rotation = Math.round(_telescope_rotation*10)/10;
        scope.telescope_model = _telescope_rotation;
        telescopeRotation(scope, scope.telescope_model); /** Telescope rotation */  
     }
     telescope_fine_angle = _current_fine_angle;
}
/** Function :- Telescope rotation */
function telescopeRotation(scope,angle){ 
    stageUpdate();/** Updating stage to apply tween effect */       
    rotationTweenEffect(zoom_container.getChildByName("drag_telescope"),angle-135);
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("telescope"),angle-90);
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("telescope_under"),angle-90);
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("main_scale"),angle-90);
    zoomMainScaleRotation(scope);
    slitMovement(scope);/** Move the slit when the telescope rotate  */
}
/** Function :- Vernier table rotation */
function verniertableRotation(scope,angle){
    stageUpdate();
    gratingRotation(scope);
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("vernier_table"),angle);/** Rotate venier table */
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("vernier_scale"),angle);/** Rotate main scale */   
    zoomMainScaleRotation(scope);
    slitMovement(scope); /** Move the slit when the telescope rotate  */
}
/** Grating rotation and display slit */
function gratingRotation(scope){
    var _angle=parseFloat(scope.grating_model);  
    if(Math.abs(_angle)>45){        
        for(var i=0;i<color_slit.length;i++){ 
            zoom_container.getChildByName(color_slit[i]).alpha=0;
        } 
    }else{
        if(scope.switch_on_off==false){  
            for(var i=0;i<color_slit.length;i++){         
                if(i<14){ /** Display/Hide first order slit */
                    zoom_container.getChildByName(color_slit[i]).alpha =  scope.place_grating ?  0 : 1;
                }else{ /** Display/Hide second order slit */
                    zoom_container.getChildByName(color_slit[i]).alpha =  scope.place_grating ?  0 : 0.5;
                } 
                zoom_container.getChildByName("white_slit_reflection").alpha =scope.place_grating ?  0 : 1;  /** Show/Hide reflection slit */     
            } 
        }
    }
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("grating"),_angle);/** Rotate grating */
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("grating_hanger"),_angle);/** Rotate grating hanger*/
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("grating_table"),_angle);/** Rotate grating table */
}
/** Function :- Zoom scale rotation */
function zoomMainScaleRotation(scope){
    rotationTweenEffect(zoom_container.getChildByName("main_1_scale_zoom"),143+(scope.telescope_model-(90-scope.vernier_model)));/** Main scale rotation in zoom 1 */
    rotationTweenEffect(zoom_container.getChildByName("main_2_scale_zoom"),143+(scope.telescope_model-(90+scope.vernier_model)));/** Main scale rotation in zoom 2 */
}
/** Function :- Updating stage to apply tween effect */
function stageUpdate(){
   createjs.Ticker.setFPS(160);
   createjs.Ticker.addEventListener("tick", spectrometer_stage); 
}
/** Function :- Apply tween effect on rotation*/
function rotationTweenEffect(obj,angle){  
    createjs.Tween.get(obj).to({
       rotation: (angle)
    },500).call(tweenEndFn , [obj.name , angle ]); 
}
/** Function :- Tween end */
function tweenEndFn(name,angle){
   if(name=="telescope" ){
        var _xRot = 331.8 * Math.cos((angle/60)+90.325) + 365;
        var _yRot = 331.8 * Math.sin((angle/60)+90.288) + 336; 
        _xRot=(Math.round(_xRot*100)/100)-6.97;
        _yRot=(Math.round(_yRot*100)/100)-30.7;
        drawDashedLine(slit_pointer_1,_xRot,_yRot,15,88,4,"#FFF",grating_spectrometer_container); 
        drawDashedLine(slit_pointer_2,_xRot,_yRot,178,88,4,"#FFF",grating_spectrometer_container); 
   }
}
/** Function :- Move the slit when the telescope rotate  */
function slitMovement(scope){  
    stageUpdate();  
    leftDirectionTween(zoom_container.getChildByName("white_slit_reflection"),slit_center_x-(Math.sin(Math.abs(parseFloat(scope.telescope_model))*3.14/180)*20+(45-Math.abs(parseFloat(scope.grating_model))))*10);  
    leftDirectionTween(zoom_container.getChildByName("white_slit"),slit_center_x-(90-parseFloat(scope.telescope_model))*10);
    /** 45 angle reflection */
    if(parseFloat(scope.telescope_model) > 90 && parseFloat(scope.grating_model) > 0 ){
        zoom_container.getChildByName("white_slit_reflection").alpha  = 0;
    }else if(parseFloat(scope.telescope_model) < 90 && parseFloat(scope.grating_model) < 0){
        zoom_container.getChildByName("white_slit_reflection").alpha  = 0;
    }else{
        zoom_container.getChildByName("white_slit_reflection").alpha  = 1;
    }
    for(var i=0;i<color_slit.length;i++){ 
        leftDirectionTween(zoom_container.getChildByName(color_slit[i]),slit_center_x+(diffraction_angle[i]-(90-parseFloat(scope.telescope_model))+(parseFloat(scope.grating_model)*0.5))*10);
    }    
}
/** Function :- Apply tween effect on x axis*/
function leftDirectionTween(obj,x_pos){
    createjs.Tween.get(obj).to({
       x: (x_pos)
    },500,createjs.Ease.getPowInOut(1)); 
}
/** Function :- Slit focus  */
function slitFocusFn(scope){
    var _blur=Math.abs(scope.slit_focus_model);
    if(_blur<=2 && _blur>=0){ /** Correct focus*/
        _blur=0;        
    }
    for(var i=0;i<color_slit.length;i++){
        applyBlurFn(color_slit[i],_blur,zoom_container); 
    }        
    spectrometer_stage.update(); /** Createjs stage updation happens */
}
/** Function :- Adjust slit width  */
function slitWidthFn(scope){
    var _slit_width=scope.slit_width_model;
    for(var i=0;i<color_slit.length;i++){
        zoom_container.getChildByName(color_slit[i]).scaleX = _slit_width;
    }
    spectrometer_stage.update(); /** Createjs stage updation happens */
}
/** Function :- Apply blur  */
function applyBlurFn(obj_name,blur,container){    
    var _blur_apply = new createjs.BlurFilter(blur, blur, blur);
    container.getChildByName(obj_name).filters = [_blur_apply]; 
    container.getChildByName(obj_name).cache(0, 0, container.getChildByName(obj_name).image.width, container.getChildByName(obj_name).image.height);
}
/** Function :- Draw dahshed line */           
function drawDashedLine(line_name,move_to_x_pos,move_to_y_pos,line_to_x_pos,line_to_y_pos,dash_difference,line_color,container){     
    line_name.graphics.clear(); //clear the previously drawn waves and plot new one for each event 
    line_name.graphics.beginStroke(line_color);
    line_name.graphics.setStrokeStyle(2);
    line_name.graphics.dashedLineTo(move_to_x_pos,move_to_y_pos,line_to_x_pos,line_to_y_pos,dash_difference);
    container.addChild(line_name); /** Add dashed line into container */
    spectrometer_stage.update(); /** Createjs stage updation happens */
} 
/** Function :- Reset */  
function reset(scope) {
    window.location.reload();
}