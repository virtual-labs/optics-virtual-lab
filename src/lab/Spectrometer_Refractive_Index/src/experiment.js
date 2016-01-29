(function() {
    angular.module('users')
        .directive("experiment", directiveFunction)
})();

var spectrometer_stage, spectrometer_container,prism_spectrometer_container, spectrometer_top_view_container;

var blur_filter, slit_blur_filter, focus_object_mask, slit_mask, slit_center_mask;

var switch_on_btn_label, switch_off_btn_label, place_prism_btn_label, remove_prism_btn_label;

var scale_mask, slit_pointer_1, slit_pointer_2;
 
var vernier1_text,vernier2_text, tick, initial_tel_angle;

var slit_center_x,reflection_ab,reflection_ac ,stageY_starting_point;

var telescope_fine_angle, vernier_fine_angle;

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
            },{/**  Prism */
                id: "prism",
                src: "././images/prism.svg",
                type: createjs.LoadQueue.IMAGE
            },{/**  Prism hanger*/
                id: "prism_hanger",
                src: "././images/prism_hanger.svg",
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
                src: "././images/light.svg",
                type: createjs.LoadQueue.IMAGE
            },{/** Slit */
                id: "slit",
                src: "././images/slit.svg",
                type: createjs.LoadQueue.IMAGE
            },{/** Cross wire */
                id: "cross_wire",
                src: "././images/cross_wire.svg",
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
            prism_spectrometer_container= new createjs.Container(); /** Prism spectrometer container*/           
            spectrometer_stage.addChild(prism_spectrometer_container); /** Add it in to the stage */  
            spectrometer_top_view_container= new createjs.Container(); /** Spectrometer top view container */
            spectrometer_stage.addChild(spectrometer_top_view_container); /** Add it in to the stage */             
            zoom_container= new createjs.Container(); /** Spectrometer top view container */
            spectrometer_stage.addChild(zoom_container); /** Add it in to the stage */ 
            /** For different shapes */
            focus_object_mask = new createjs.Shape();
            slit_mask= new createjs.Shape();
            vernier_scale_1_mask= new createjs.Shape();
            vernier_scale_2_mask= new createjs.Shape();
            slit_pointer_1= new createjs.Shape();
            slit_pointer_2= new createjs.Shape();
            slit_center_mask = new createjs.Shape();

            function handleComplete() {
                initialisationOfVariables(); /** Initializing the variables */
                translationLabels(); /** Translation of strings using gettext */ 
                /** Load images */
                loadImages(queue.getResult("background_side_view"), "background_side_view", 0, 0, "", 1, 1, focus_telescope_container); /** Spectrometer side view background  */ 
                loadImages(queue.getResult("background_top_view"), "background_top_view", 0, 0, "", 1, 1, prism_spectrometer_container); /** Spectrometer top view background  */  
                loadImages(queue.getResult("telescope_under"), "telescope_under", 289, 438, "", 1.4, 1, spectrometer_top_view_container); /** Telescope under table  */  
                loadImages(queue.getResult("collimator_under"), "collimator_under", 260, 290, "", 1.1, 1, spectrometer_top_view_container); /** Collimator under table   */  
                loadImages(queue.getResult("main_scale"), "main_scale",289, 438 , "", 0.154, 1, spectrometer_top_view_container); /** Main scale  */  
                loadImages(queue.getResult("vernier_scale"), "vernier_scale", 290, 438, "", 0.154, 1, spectrometer_top_view_container); /** Vernier scale  */  
                loadImages(queue.getResult("vernier_table"), "vernier_table", 289, 438, "", 1.1, 1, spectrometer_top_view_container); /** Vernier table  */  
                loadImages(queue.getResult("telescope"), "telescope", 289, 438 , "", 1.4, 1, spectrometer_top_view_container); /** Telescope  */  
                loadImages(queue.getResult("collimator"), "collimator", 282, 405, "", 1.4, 1, spectrometer_top_view_container); /** Collimator */  
                loadImages(queue.getResult("prism"), "prism", 289, 438, "", 1.1, 0, spectrometer_top_view_container); /** Prism  */  
                loadImages(queue.getResult("prism_hanger"), "prism_hanger", 289, 438, "", 1.1, 1, spectrometer_top_view_container); /** Prism hanger */  
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
                loadImages(queue.getResult("slit"), "slit_center", slit_center_x , 89 , "", 1 , 0, zoom_container); /** Slit  */ 
                loadImages(queue.getResult("slit"), "slit_left", slit_center_x-20 , 89 , "", 1 , 0, zoom_container); /** Slit left */
                loadImages(queue.getResult("slit"), "slit_right", slit_center_x+20 , 89 , "", 1 , 0, zoom_container); /** Slit center */ 
                drawRectangle(slit_center_mask, 85, 5, 25 , 175 , "" , "#000" , zoom_container)// Slit
                loadImages(queue.getResult("focus_object"), "focus_object", 50, -50, "", 1, 1, focus_telescope_container); /** Focus object */
                loadImages(queue.getResult("cross_wire"), "cross_wire", 6, 0, "", 1, 1, zoom_container); /** Cross wire  */  
                /** Draw dashed line for pointing to slit  */
                drawDashedLine(slit_pointer_1,spectrometer_top_view_container.getChildByName("telescope").x-160,spectrometer_top_view_container.getChildByName("telescope").y+140,15,88,4,"#FFF",zoom_container); /** Dashed line */
                drawDashedLine(slit_pointer_2,spectrometer_top_view_container.getChildByName("telescope").x-160,spectrometer_top_view_container.getChildByName("telescope").y+140,178,88,4,"#FFF",zoom_container); /** Dashed line */
                loadImages(queue.getResult("telescope"), "drag_telescope", 358, 339 , "pointer", 1.4, 0.01, zoom_container); /** Drag telescope  */  
                zoom_container.getChildByName("drag_telescope").rotation=-45;
                zoom_container.getChildByName("main_1_scale_zoom").rotation=-7.045;
                zoom_container.getChildByName("main_2_scale_zoom").rotation=-7.045;
                spectrometer_top_view_container.getChildByName("main_scale").rotation=-7.045;
                spectrometer_top_view_container.getChildByName("vernier_table").rotation=10;/** Rotate venier table */
                spectrometer_top_view_container.getChildByName("vernier_scale").rotation=10;/** Rotate venier scale */               
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
                    _bitmap.mask = focus_object_mask;
                    _bitmap.filters = [blur_filter];
                    _bitmap.cache(0, 0, _bitmap.image.width, _bitmap.image.height);
                }
                if (name == "slit_center" || name == "slit_left" || name == "slit_right"  ) { /** Mask and blur apply on the slit */
                    _bitmap.mask = slit_mask;
                    _bitmap.filters = [slit_blur_filter];
                    _bitmap.cache(0, 0, _bitmap.image.width, _bitmap.image.height);
                    _bitmap.regX = _bitmap.image.width / 2;
                    _bitmap.regY = _bitmap.image.height / 2;
                } 
                if (name == "vernier_1_scale_zoom" || name == "main_1_scale_zoom" ) { /** Mask apply on the vernier 1 zoom */
                    _bitmap.mask = vernier_scale_1_mask;
                } 
                if (name == "vernier_2_scale_zoom" || name == "main_2_scale_zoom" ) { /** Mask apply on the vernier 2 zoom */
                    _bitmap.mask = vernier_scale_2_mask;
                } 
                if ( name == "vernier_table"  || name == "vernier_scale" || name == "main_scale" || name == "prism" || name == "prism_hanger" || name == "main_1_scale_zoom" || name == "vernier_1_scale_zoom" || name == "main_2_scale_zoom" || name == "vernier_2_scale_zoom" ) { // Set rotation center
                    _bitmap.regX = _bitmap.image.width / 2;
                    _bitmap.regY = _bitmap.image.height / 2;                    
                }
                if ( name == "telescope" || name == "telescope_under" || name == "drag_telescope") { // Set rotation center
                    _bitmap.regX = _bitmap.image.width;
                    _bitmap.regY = _bitmap.image.height/2;
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
                scope.heading = _("Prism spectrometer"); /** Experiment title */
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
                place_prism_btn_label = _("Place prism");/** 'Place prism/Remove prism' label */
                remove_prism_btn_label = _("Remove prism");/** 'Remove prism'  label  */
                scope.prism_btn_label = place_prism_btn_label; /** 'Place prism'  label */
                scope.change_angle_label = _("Change angle:"); /** 'Change angle'  label */
                scope.telescope_label = _("Telescope"); /** 'Telescope'  label */
                scope.vernier_table_label = _("Vernier table"); /** 'Vernier table'  label */
                scope.fine_angle_label = _("Fine angle:"); /** 'Fine angle'  label */  
                vernier1_text = _("Vernier 1"); /** 'Fine angle'  label */  
                vernier2_text = _("Vernier 2"); /** 'Fine angle'  label */               
                scope.$apply();
            } 
            /** All variables initialising in this function */
            function initialisationOfVariables() { 
                spectrometer_top_view_container.rotation=-45;
                spectrometer_top_view_container.y=230;
                spectrometer_top_view_container.x=-150;           
                blur_filter = new createjs.BlurFilter(15, 15, 15); 
                slit_blur_filter = new createjs.BlurFilter(5, 5, 5);
                slit_center_mask.mask = slit_mask;
                scope.telescope_model=0;  
                scope.vernier_model=10; 
                scope.telescope_fine_model=0;  
                scope.vernier_fine_model=0; 
                focus_telescope_container.visible=true;
                prism_spectrometer_container.visible=false;                
                spectrometer_top_view_container.visible=false;
                zoom_container.visible=false;
                stageY_starting_point=0;
                slit_center_x=97; 
                reflection_ab=60;
                reflection_ac=-60;
                telescope_fine_angle=0;
                vernier_fine_angle=0;
                initial_tel_angle=0;
            }                                
        }
    }
}

/** Drag telescope to adjust the telescope movement */
function dragTelescope(scope) { 
    // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    var _limit_flag = false;
    var _angle=parseFloat(scope.telescope_model);
    zoom_container.getChildByName("drag_telescope").on("pressmove", function (evt) { 
       if(_angle > -150  &&  _angle < 150){            
            var _adj = evt.stageX - 365;
            var _opp = evt.stageY - 336;
            _angle = Math.atan2(_opp, _adj); 
            _angle = _angle / (Math.PI / 180)-135;
            _angle=Math.round(_angle*10)/10; 
            if(_angle<-150){                
                _angle=_angle+360;                
            }           
            _angle=Math.round(_angle*10)/10;                                                      
        }else{
            _limit_flag = true;            
        }        
        telescopeMOve(scope,_angle);           
        spectrometer_stage.update();    
    });
   zoom_container.getChildByName("drag_telescope").on("pressup", function (evt) { 
       if(_limit_flag){
            _limit_flag = false;   
            if(_angle > 200){
                _angle = -149;
                 scope.telescope_model = -150;
            }else{                
                _angle = _angle < 0 ? -149 : 149;  
                 scope.telescope_model = _angle+1;  
            }                                      
        } else{
            scope.telescope_model=_angle.toFixed(1); 
        }        
        scope.$apply(); 
        telescopeMOve(scope,_angle); 
        zoomMainScaleRotation(scope);   
        spectrometer_stage.update();        
    });
}
function telescopeMOve(scope,angle){
    zoom_container.getChildByName("drag_telescope").rotation = angle-45;
    spectrometer_top_view_container.getChildByName("telescope").rotation = angle;
    spectrometer_top_view_container.getChildByName("telescope_under").rotation = angle;
    spectrometer_top_view_container.getChildByName("main_scale").rotation=angle; 
    tweenEndFn("telescope",angle); 
    slit_center_mask.x = 1+(parseFloat(scope.telescope_model)-parseFloat(scope.vernier_model))*10;
    zoom_container.getChildByName("slit_center").x = slit_center_x+parseFloat(scope.telescope_model)*10;
    zoom_container.getChildByName("slit_right").x = slit_center_x+(reflection_ac+parseFloat(scope.telescope_model))*10;
    zoom_container.getChildByName("slit_left").x = slit_center_x+(reflection_ab+parseFloat(scope.telescope_model))*10;   
    spectrometer_stage.update(); 
}
/**  Function :- Change focus telescope slider   */
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
    prism_spectrometer_container.visible=true;/**To hide focus telescope container */
    spectrometer_top_view_container.visible=true;/**To show top view prism spectrometer container */
    focus_telescope_container.visible=false;/**To show prism spectrometer container */
    zoom_container.visible=true;/**To show zoom container */
    spectrometer_stage.update(); /** Createjs stage updation happens */
}
/** Function :-  Switch on / off  button click*/
function switchOnOrOffFn(scope) { 
    scope.disabled_status = scope.switch_on_off ;/** Enabled /Disabled*/
    scope.switch_btn_label = scope.switch_on_off ? switch_on_btn_label : switch_off_btn_label;  /** Change label :- 'Switch on/off light' */
    spectrometer_top_view_container.getChildByName("light").alpha = scope.switch_on_off ?  0 : 1 ;  /** 'Switch on/off light' */
    dragTelescope(scope);/** Drag telescope to adjust the telescope position  */
    displaySlit(scope);/** Display slit */
    slitMovement(scope); /** Move the slit when the telescope rotate  */    
    spectrometer_stage.update();/** Createjs stage updation happens */
}
/** Function :-  Place prism button click */
function placePrismFn(scope) {
    scope.prism_btn_label = scope.place_prism ? place_prism_btn_label : remove_prism_btn_label;  /** Change label :- 'Place/Remove prism' */
    spectrometer_top_view_container.getChildByName("prism").alpha = scope.place_prism ?  0 : 1 ;  /** 'Place/Remove prism' */
    displaySlit(scope);/** Display slit */
    slitMovement(scope);/** Move the slit when the telescope rotate  */   
    spectrometer_stage.update();/** Createjs stage updation happens */
}
/** Function :-  To display slit */
function displaySlit(scope){
    zoom_container.getChildByName("slit_center").alpha = scope.switch_on_off  ?  0 : 1;      
    if(scope.switch_on_off==false){
         zoom_container.getChildByName("slit_right").alpha = zoom_container.getChildByName("slit_left").alpha = scope.place_prism ?  0 : 1;
         zoom_container.getChildByName("slit_center").alpha = scope.place_prism ?  1 : 0;
    }else{
        zoom_container.getChildByName("slit_right").alpha = zoom_container.getChildByName("slit_left").alpha = 0 ;
    }
}
/** Function :- Telescope rotation*/
function telescopeRotateFn(scope) {     
    telescopeRotation(scope,scope.telescope_model); /** Telescope rotation */ 
}
/** Function :- Vernier table rotation */
function verniertableRotateFn(scope) {  
    verniertableRotation(scope,scope.vernier_model);/** Vernier table rotation */    
}
/** Function :- Telescope fine rotation */
function telescopeFineRotateFn(scope) {  
     var _current_fine_angle = parseFloat(scope.telescope_fine_model);  
     var _change_angle = _current_fine_angle - telescope_fine_angle;     
     if(Math.abs(parseFloat(scope.telescope_model) + _change_angle)  <= 150){
        var _telescope_rotation = parseFloat(scope.telescope_model) + _change_angle ;
        _telescope_rotation = Math.round(_telescope_rotation*10)/10;
        scope.telescope_model = _telescope_rotation;
        telescopeRotation(scope, scope.telescope_model); /** Telescope rotation */  
     }
     telescope_fine_angle = _current_fine_angle;
}
/** Function : Vernier table fine rotation  */
function verniertableFineRotateFn(scope) {    
    var _current_fine_angle = scope.vernier_fine_model  
    var _change_angle = _current_fine_angle - vernier_fine_angle;       
    if(Math.abs(scope.vernier_model + _change_angle)  <= 180){
        var _vernier_rotation = scope.vernier_model + _change_angle ;
        _vernier_rotation = Math.round(_vernier_rotation*10)/10;
        scope.vernier_model = _vernier_rotation;
        verniertableRotation(scope, scope.vernier_model); /** Vernier rotation */  
    }
    vernier_fine_angle = _current_fine_angle;
}
/** Function :- Telescope rotation */
function telescopeRotation(scope,angle){
    rotationTweenEffect(zoom_container.getChildByName("drag_telescope"),angle-45);
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("telescope"),angle);
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("telescope_under"),angle);
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("main_scale"),angle);
    zoomMainScaleRotation(scope);    
    slitMovement(scope);/** Move the slit when the telescope rotate  */
    stageUpdate();/** Updating stage to apply tween effect */      
}
/** Function :- Vernier table rotation */
function verniertableRotation(scope,angle){    
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("prism"),angle);/** Rotate prism */
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("prism_hanger"),angle);/** Rotate prism hanger*/
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("vernier_table"),angle);/** Rotate venier table */
    rotationTweenEffect(spectrometer_top_view_container.getChildByName("vernier_scale"),angle);/** Rotate main scale */
    zoomMainScaleRotation(scope);
    reflectionCalculation(scope);    
    slitMovement(scope); /** Move the slit when the telescope rotate  */
    stageUpdate();
}
function zoomMainScaleRotation(scope){
    rotationTweenEffect(zoom_container.getChildByName("main_1_scale_zoom"),143+(parseFloat(scope.telescope_model)-parseFloat(scope.vernier_model)));/** Main scale rotation in zoom 1 */
    rotationTweenEffect(zoom_container.getChildByName("main_2_scale_zoom"),143+(parseFloat(scope.telescope_model)-parseFloat(scope.vernier_model)));/** Main scale rotation in zoom 2 */
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

function tweenEndFn(name,angle){
   if(name=="telescope" ){   
        var _xRot = 331.8 * Math.cos((angle/60)+90.325) + 365;
        var _yRot = 331.8 * Math.sin((angle/60)+90.288) + 336; 
        _xRot=(Math.round(_xRot*100)/100)-6.97;
        _yRot=(Math.round(_yRot*100)/100)-30.7;
        drawDashedLine(slit_pointer_1,_xRot,_yRot,15,88,4,"#FFF",prism_spectrometer_container); 
        drawDashedLine(slit_pointer_2,_xRot,_yRot,178,88,4,"#FFF",prism_spectrometer_container);        
   } 
}
/** Function :- Calculation of light reflection  */
function reflectionCalculation(scope){
    var _angle_of_prism=60,_incident_angle_ab,_incident_angle_ac,_refractive_index_prism=1.5,_refractive_index_surrounding=1;
    var _radian = Math.PI/180; /** To convert into radian for trignometric calculation */
    var _degree = 180/Math.PI; /** To convert into degree for trignometric calculation */
    /** D=i+SIN-1(SIN(A)* √(n2/n2s-SIN2(i))-COS(A)*SIN(i))-A */
    if(Math.abs(scope.vernier_model + scope.vernier_fine_model + _angle_of_prism/2 - 90)>90){
        _incident_angle_ab = NaN; 
    }else{
        _incident_angle_ab = scope.vernier_model + scope.vernier_fine_model + _angle_of_prism/2 - 90;      
    }
    if(Math.abs(-(90 + (scope.vernier_model + scope.vernier_fine_model - _angle_of_prism/2))) > 90){
        _incident_angle_ac = NaN;
    }else{
        _incident_angle_ac = -(90 + (scope.vernier_model + scope.vernier_fine_model - _angle_of_prism/2));
    }
    /** Reflection  */
    if(Math.abs(scope.vernier_model+scope.vernier_fine_model+_angle_of_prism/2-90)>90){
        reflection_ab = _incident_angle_ac + Math.asin(Math.sin(_angle_of_prism * _radian) * Math.pow((Math.pow(_refractive_index_prism,2) / Math.pow(_refractive_index_surrounding,2)) - Math.pow(Math.sin(_incident_angle_ac * _radian),2),0.5) - Math.cos(_angle_of_prism * _radian) * Math.sin(_incident_angle_ac * _radian)) * _degree - _angle_of_prism;
    }else{        
        if((180 - 2 *_incident_angle_ab) > 180){
            reflection_ab = (180 - 2 * _incident_angle_ab) - 360;
            
        }else{
            reflection_ab = 180 - 2 * _incident_angle_ab;
        }          
    }
    if(Math.abs(-(90 + (scope.vernier_model + scope.vernier_fine_model - _angle_of_prism/2))) > 90){
        reflection_ac = -(_incident_angle_ab + Math.asin(Math.sin(_angle_of_prism * _radian) * Math.pow((Math.pow(_refractive_index_prism,2)/Math.pow(_refractive_index_surrounding,2)) - Math.pow(Math.sin(_incident_angle_ab * _radian),2),0.5) - Math.cos(_angle_of_prism * _radian) * Math.sin(_incident_angle_ab * _radian)) * _degree - _angle_of_prism);
    }else{
        if((180+2*_incident_angle_ac)>180){
            reflection_ac = (180 + 2*_incident_angle_ac) - 360;
            
        }else{
            reflection_ac = 180 + 2*_incident_angle_ac;
        }
    }
}
/** Function :- Move the slit when the telescope rotate  */
function slitMovement(scope){  
    stageUpdate(); 
    leftDirectionTween(slit_center_mask,1+(parseFloat(scope.telescope_model)-parseFloat(scope.vernier_model))*10);
    leftDirectionTween(zoom_container.getChildByName("slit_center"),slit_center_x+(parseFloat(scope.telescope_model))*10);
    leftDirectionTween(zoom_container.getChildByName("slit_right"),slit_center_x+(reflection_ac+parseFloat(scope.telescope_model))*30);
    leftDirectionTween(zoom_container.getChildByName("slit_left"),slit_center_x+(reflection_ab+parseFloat(scope.telescope_model))*30);
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
    applyBlurFn("slit_center",_blur,zoom_container); 
    applyBlurFn("slit_right",_blur,zoom_container); 
    applyBlurFn("slit_left",_blur,zoom_container);       
    spectrometer_stage.update(); /** Createjs stage updation happens */
}
/** Function :- Adjust slit width  */
function slitWidthFn(scope){
    var _slit_width=2.22*scope.slit_width_model+0.778;
    zoom_container.getChildByName("slit_center").scaleX = zoom_container.getChildByName("slit_center").scaleY = _slit_width;
    zoom_container.getChildByName("slit_left").scaleX = zoom_container.getChildByName("slit_left").scaleY = _slit_width;
    zoom_container.getChildByName("slit_right").scaleX = zoom_container.getChildByName("slit_right").scaleY = _slit_width;
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