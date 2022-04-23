(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"גורל הבקבוק סופי_1_atlas_1", frames: [[732,0,674,583],[0,1614,535,428],[570,1387,645,516],[570,788,645,597],[1217,819,645,516],[1217,1337,535,463],[0,788,568,824],[1408,0,416,817],[0,0,730,786]]},
		{name:"גורל הבקבוק סופי_1_atlas_2", frames: [[0,430,593,149],[1461,1206,388,144],[595,430,433,177],[1668,1352,294,118],[1610,0,384,208],[0,1363,294,118],[821,1367,294,118],[296,1449,294,118],[1610,210,384,208],[0,1217,388,144],[0,581,433,177],[991,1220,348,145],[1940,855,102,74],[239,946,122,35],[239,892,123,52],[1723,756,115,78],[364,892,63,98],[1996,0,27,37],[1880,420,160,433],[435,609,160,433],[597,609,160,433],[759,609,160,433],[921,624,160,433],[1083,624,160,433],[390,1232,509,106],[1341,1352,325,118],[991,1059,208,47],[1117,1472,394,78],[1513,1472,301,94],[0,0,535,428],[592,1487,334,48],[1379,467,499,157],[537,0,535,428],[390,1340,429,107],[1610,420,180,34],[1461,914,204,290],[1723,855,215,304],[1245,914,214,304],[1245,626,237,286],[1484,626,237,286],[0,760,237,286],[1723,626,110,128],[239,760,181,130],[1074,0,303,622],[1379,0,229,465],[239,1044,374,171],[615,1059,374,171],[0,1048,207,154]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_61 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_59 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58copy2 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_57 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_56 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_53 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_51 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_54 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(37);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(38);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(39);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(40);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(41);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(42);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(43);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(44);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(img.CachedBmp_6);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,7338,2972);


(lib.CachedBmp_5 = function() {
	this.initialize(img.CachedBmp_5);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,7338,2972);


(lib.CachedBmp_4 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(45);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(46);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_70 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_2"]);
	this.gotoAndStop(47);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["גורל הבקבוק סופי_1_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.עיניפח = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_6 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("AFpCIIhpgHQgigDgbgqQgbgrgHhBIgKhPIFKAWIgMBEQgLBDgeAqQgdAogiAAIgEAAgAkOBnIhpgHQgigDgbgqQgbgrgHhBIgKhOIFKAVIgMBEQgLBEgeAqQgdAogiAAIgEgBg");
	mask.setTransform(48.075,13.6046);

	// Layer_7
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#999999").s().p("ACXBQIAAh3IFaAAIAAB3QithWitBWgAnwAoIAAh3IFaAAIAAB3QithEitBEg");
	this.shape.setTransform(48.075,-10);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#999999").s().p("AA/BrIA9kDIFaAAIA3E6QhpAfhbAAQiXAAhzhWgAoMBIIAAkIIGbAAIAAE/QhTAdhOAAQiFAAh1hUg");
	this.shape_1.setTransform(50.825,1.3473);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#999999").s().p("ABBByIA8kMIFaAAIA1FBQhmAchaAAQiYAAhzhRgAoLBNIAAkPIGbAAIgDFEQhSAbhMAAQiFAAh1hQg");
	this.shape_2.setTransform(50.725,1.542);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#999999").s().p("ABCB4IA8kUIFaAAIAzFIQhkAZhXAAQiaAAh0hNgAoKBSIAAkWIGbAAIgFFKQhQAYhLAAQiFAAh2hMg");
	this.shape_3.setTransform(50.625,1.7395);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#999999").s().p("ABDB/IA7kdIFbAAIAxFPQhhAWhWAAQibAAh1hIgAoJBWIAAkcIGbAAIgIFPQhOAWhKAAQiEAAh3hJg");
	this.shape_4.setTransform(50.55,1.9276);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#999999").s().p("ABFCFIA6klIFbAAIAvFWQheAThUAAQicAAh2hEgAoIBbIAAkjIGbAAIgLFUQhLAUhIAAQiFAAh4hFg");
	this.shape_5.setTransform(50.45,2.1269);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#999999").s().p("ABGCMIA6kuIFbAAIAtFdQhbAQhQAAQifAAh4g/gAoHBgIAAkqIGbAAIgOFZQhJAShGAAQiFAAh5hBg");
	this.shape_6.setTransform(50.35,2.3279);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#999999").s().p("ABHCSIA6k2IFbAAIArFkQhWANhOAAQihAAh7g7gAoGBlIAAkxIGbAAIgRFeQhHAQhEAAQiFAAh6g9g");
	this.shape_7.setTransform(50.25,2.5311);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#999999").s().p("ABJCZIA5k/IFbAAIApFrQhRAKhJAAQimAAh9g2gAoFBqIAAk4IGbAAIgTFkQhEANhCAAQiGAAh8g5g");
	this.shape_8.setTransform(50.15,2.7373);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#999999").s().p("ABKCfIA5lHIFaAAIAoFyQhKAHhEAAQirAAiCgygAoEBvIAAk/IGbAAIgWFpQhBALhAAAQiHAAh9g1g");
	this.shape_9.setTransform(50.075,2.946);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#999999").s().p("ABLClIA5lQIFaAAIAmF5QhCAFg+ABQiyAAiHgvgAoDBzIAAlGIGbAAIgZFvQg+AJg8AAQiIAAiAgyg");
	this.shape_10.setTransform(49.975,3.1501);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#999999").s().p("ABMCrIA5lYIFaAAIAkGAQg2ADg0AAQi+AAiPgrgAoCB4IAAlNIGbAAIgcF0Qg5AHg4AAQiLAAiDgug");
	this.shape_11.setTransform(49.875,3.3785);

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#999999").s().p("ABOCxIA4lgIFaAAIAiGGIhHABQjTAAiagngAoBB9IAAlUIGbAAIgfF4Qg0AGg0AAQiNAAiHgqg");
	this.shape_12.setTransform(49.775,3.6281);

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#999999").s().p("ABPC3IA4lpIFaAAIAgGNIgHAAQj6AAixgkgAoACBIAAlbIGbAAIghF+QguADgtAAQiSAAiNgmg");
	this.shape_13.setTransform(49.675,3.9253);

	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f("#999999").s().p("ABQC8IA4lyIFaAAIAfGVQj+gHizgcgAn/CEIAAliIGaAAIgkGDQglACgkAAQiZAAiUgjg");
	this.shape_14.setTransform(49.6,4.275);

	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f("#999999").s().p("ABSDBIA3l6IFaAAIAcGbQj6gNizgUgAn+CIIAAlpIGaAAIgmGIIgxAAQijAAiggfg");
	this.shape_15.setTransform(49.5,4.625);

	this.shape_16 = new cjs.Shape();
	this.shape_16.graphics.f("#999999").s().p("ABTDGIA3mDIFaAAIAaGiQj4gTizgMgAn9CLIAAlwIGaAAIgpGOQi5AAi4geg");
	this.shape_16.setTransform(49.4,4.95);

	this.shape_17 = new cjs.Shape();
	this.shape_17.graphics.f("#999999").s().p("ABVDLIA2mLIFaAAIAZGpQj3gbiygDgAn8COIAAl2IGaAAIgsGSQi2gEi4gYg");
	this.shape_17.setTransform(49.3,5.3);

	this.shape_18 = new cjs.Shape();
	this.shape_18.graphics.f("#999999").s().p("ABVDQIA3mUIFaAAIAXGxQj2gjiyAGgAn8CSIAAl+IGbAAIgvGYQizgKi5gQg");
	this.shape_18.setTransform(49.225,5.65);

	this.shape_19 = new cjs.Shape();
	this.shape_19.graphics.f("#999999").s().p("ABXDVIA2mcIFaAAIAVG3Qj0gpixAOgAn7CWIAAmFIGbAAIgxGdQixgQi5gIg");
	this.shape_19.setTransform(49.125,6);

	this.shape_20 = new cjs.Shape();
	this.shape_20.graphics.f("#999999").s().p("ABYDaIA2mlIFaAAIATG+QjygvixAWgAn6CZIAAmMIGbAAIg0GjQiugVi5gCg");
	this.shape_20.setTransform(49.025,6.35);

	this.shape_21 = new cjs.Shape();
	this.shape_21.graphics.f("#999999").s().p("ABZDfIA2mtIFaAAIARHFQjwg3ixAfgAn5CcIAAmSIGbAAIg3GoQirgai5AEg");
	this.shape_21.setTransform(48.925,6.7);

	this.shape_22 = new cjs.Shape();
	this.shape_22.graphics.f("#999999").s().p("ABbDkIA1m1IFaAAIAPHLQjug9iwAngAn4CgIAAmZIGbAAIg6GsQiogfi5AMg");
	this.shape_22.setTransform(48.825,7.025);

	this.shape_23 = new cjs.Shape();
	this.shape_23.graphics.f("#999999").s().p("ABcDpIA0m+IFbAAIANHTQjshFiwAwgAn3CjIAAmgIGbAAIg9GyQimgki4ASg");
	this.shape_23.setTransform(48.75,7.375);

	this.shape_24 = new cjs.Shape();
	this.shape_24.graphics.f("#999999").s().p("ABdDuIA0nGIFbAAIALHZQjqhLiwA4gAn2CnIAAmnIGbAAIg/G3Qikgqi4Aag");
	this.shape_24.setTransform(48.65,7.725);

	this.shape_25 = new cjs.Shape();
	this.shape_25.graphics.f("#999999").s().p("ABeDzIA0nPIFbAAIAJHhQjohTiwBBgAn1CqIAAmuIGbAAIhCG8Qihgui4Agg");
	this.shape_25.setTransform(48.55,8.075);

	this.shape_26 = new cjs.Shape();
	this.shape_26.graphics.f("#999999").s().p("ABgD4IAznXIFbAAIAHHnQjmhZivBJgAn0CuIAAm1IGbAAIhFHBQieg0i4Aog");
	this.shape_26.setTransform(48.45,8.425);

	this.shape_27 = new cjs.Shape();
	this.shape_27.graphics.f("#999999").s().p("ABiD9IAyngIFbAAIAFHvQjkhhiuBSgAnzCxIAAm8IGbAAIhHHHQicg5i4Aug");
	this.shape_27.setTransform(48.35,8.775);

	this.shape_28 = new cjs.Shape();
	this.shape_28.graphics.f("#999999").s().p("ABjECIAynoIFaAAIAEH1QjihniuBagAnyC1IAAnDIGbAAIhLHMQiYg/i4A2g");
	this.shape_28.setTransform(48.275,9.1);

	this.shape_29 = new cjs.Shape();
	this.shape_29.graphics.f("#999999").s().p("ABkEHIAynxIFaAAIACH8QjghtiuBigAnxC4IAAnKIGbAAIhNHSQiWhEi4A8g");
	this.shape_29.setTransform(48.175,9.45);

	this.shape_30 = new cjs.Shape();
	this.shape_30.graphics.f("#999999").s().p("ABlEMIAyn5IFaAAIAAIDQjeh1iuBrgAnwC7IAAnQIGbAAIhQHWQiThIi4BCg");
	this.shape_30.setTransform(48.075,9.8);

	var maskedShapeInstanceList = [this.shape,this.shape_1,this.shape_2,this.shape_3,this.shape_4,this.shape_5,this.shape_6,this.shape_7,this.shape_8,this.shape_9,this.shape_10,this.shape_11,this.shape_12,this.shape_13,this.shape_14,this.shape_15,this.shape_16,this.shape_17,this.shape_18,this.shape_19,this.shape_20,this.shape_21,this.shape_22,this.shape_23,this.shape_24,this.shape_25,this.shape_26,this.shape_27,this.shape_28,this.shape_29,this.shape_30];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1}]},4).to({state:[{t:this.shape_2}]},1).to({state:[{t:this.shape_3}]},1).to({state:[{t:this.shape_4}]},1).to({state:[{t:this.shape_5}]},1).to({state:[{t:this.shape_6}]},1).to({state:[{t:this.shape_7}]},1).to({state:[{t:this.shape_8}]},1).to({state:[{t:this.shape_9}]},1).to({state:[{t:this.shape_10}]},1).to({state:[{t:this.shape_11}]},1).to({state:[{t:this.shape_12}]},1).to({state:[{t:this.shape_13}]},1).to({state:[{t:this.shape_14}]},1).to({state:[{t:this.shape_15}]},1).to({state:[{t:this.shape_16}]},1).to({state:[{t:this.shape_17}]},1).to({state:[{t:this.shape_18}]},1).to({state:[{t:this.shape_19}]},1).to({state:[{t:this.shape_20}]},1).to({state:[{t:this.shape_21}]},1).to({state:[{t:this.shape_22}]},1).to({state:[{t:this.shape_23}]},1).to({state:[{t:this.shape_24}]},1).to({state:[{t:this.shape_25}]},1).to({state:[{t:this.shape_26}]},1).to({state:[{t:this.shape_27}]},1).to({state:[{t:this.shape_28}]},1).to({state:[{t:this.shape_29}]},1).to({state:[{t:this.shape_30}]},1).wait(5));

	// Layer_1
	this.shape_31 = new cjs.Shape();
	this.shape_31.graphics.f().s("#221F20").ss(0.7).p("AFpCIIhpgIQgigCgbgqQgbgrgHhBIgKhOIFKAUIgLBFQgMBEgeAqQgfApgkgCgAkOBoIhpgHQgigDgbgqQgbgrgHhBIgKhPIFKAWIgMBEQgLBDgeAqQgeAqglgCg");
	this.shape_31.setTransform(48.0792,13.5854);

	this.shape_32 = new cjs.Shape();
	this.shape_32.graphics.f("#221F20").s().p("AEIA6QgWgTAAgdQAAgbAWgVQAXgTAfAAQAfAAAXATQAWAVAAAbQAAAdgWATQgXAUgfAAQgfAAgXgUgAlyAmQgXgVAAgaQAAgcAXgUQAVgUAgAAQAfAAAXAUQAWAUAAAcQAAAbgWAUQgXATgfAAQggAAgVgTg");
	this.shape_32.setTransform(43.425,11.925);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_32},{t:this.shape_31}]}).wait(38));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,98.2,29.2);


(lib.למחזר = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_60();
	this.instance.setTransform(-92.1,16.75,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.instance_1 = new lib.CachedBmp_61();
	this.instance_1.setTransform(-116.6,-36.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-116.6,-36.1,337,291.5);


(lib.playG = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_57();
	this.instance.setTransform(28.35,18.15,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_56();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,192,104);


(lib.againG = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_49();
	this.instance.setTransform(11.1,6.5,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_58();
	this.instance_1.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.5,216.5,88.5);


(lib.הייתיכולה = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_46();
	this.instance.setTransform(-89.5,-9.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_2
	this.instance_1 = new lib.CachedBmp_47();
	this.instance_1.setTransform(-142.05,-54.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-142,-54.1,267.5,214);


(lib.פקקבקבוק = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.lf(["#39458E","#2B376C","#354084","#2F3B76","#333F7F","#313C7A","#323E7D","#313D7B","#323D7C"],[0,0.149,0.278,0.404,0.533,0.635,0.757,0.867,0.976],-9.9,0,10,0).s().p("AhAA9QgOAAgLgKQgKgLAAgOIAAg0QAAgOAKgKQALgKAOAAICBAAQAOAAALAKQAKAKAAAOIAAA0QAAAOgKALQgLAKgOAAg");
	this.shape.setTransform(9.975,6.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,20,12.2);


(lib.פה11 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_44();
	this.instance.setTransform(0,0,0.3563,0.3563);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,43.5,12.5);


(lib.פה3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_43();
	this.instance.setTransform(0,0,0.4686,0.4686);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,57.7,24.4);


(lib.פה2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_42();
	this.instance.setTransform(0,0,0.4686,0.4686);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,53.9,36.6);


(lib.פהמופתע = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_41();
	this.instance.setTransform(0,0,0.4686,0.4686);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,29.5,45.9);


(lib.אישון2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_40();
	this.instance.setTransform(-6.7,-9.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-6.7,-9.2,13.5,18.5);


(lib.גבות2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#323030").s().p("AhnA0QAxhJBJgYQAqgMAlAGQAFABABABIgBAGIgFAYQgBAFgGgBIgTgEQgkgHgrAQQgqAPgoAmQgKAKgDABg");
	this.shape.setTransform(8.2967,4.3436,0.799,0.799);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#323030").s().p("AgOgVQgjgJgkAIIgIACQgFABgCgFIgDgOQgDgOACgCQACgDAOgBQA3gDAvAaQAzAdAlA2QAFAGgBAFQg1g+hDgSg");
	this.shape_1.setTransform(42.9593,4.7446,0.799,0.799);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,51.5,9.5);


(lib.לפתוחקודם = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_32();
	this.instance.setTransform(-5.25,39.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.instance_1 = new lib.CachedBmp_33();
	this.instance_1.setTransform(-35.95,-44.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-35.9,-44.4,322.5,258);


(lib.למהה = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_30();
	this.instance.setTransform(111.7,427.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.instance_1 = new lib.CachedBmp_31();
	this.instance_1.setTransform(39.75,354.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(39.8,354.5,322.5,298.5);


(lib.Tween5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_28();
	this.instance.setTransform(-51.95,-11.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-51.9,-11.6,104,23.5);


(lib.לאלפח = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_26();
	this.instance.setTransform(23.55,34.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_3
	this.instance_1 = new lib.CachedBmp_27();
	this.instance_1.setTransform(-11.7,-26.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.7,-26.5,267.5,231.5);


(lib.יוםיפהלשתותמים = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#221F20").p("ABjgLQACgCAAgFQAAgKgKgGQgLgHgOAAIgHABQgCgIgJgFQgKgGgNAAQgOAAgLAHQgJgGgPAAQgWAAgJANIgEAAQgPAAgKAGQgKAHAAAJQAAAEADAFQgMACgHAGQgHAGAAAHQAAAIAIAHQAJAGANABIgBADQAAAKAKAGQALAHAOAAQALAAAJgEQAKAJASAAQATAAAKgLQAJAEAKAAQAOAAAKgGQAKgHABgJIAGAAQAOAAAKgGQAKgHAAgJQAAgNgTgHg");
	this.shape.setTransform(11.825,207.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AghAyQgJAFgLAAQgOgBgLgGQgKgGAAgKIABgDQgNgBgJgHQgIgGAAgIQAAgIAHgFQAHgGAMgCQgDgFAAgEQAAgKAKgGQAKgHAPABIAEAAQAJgNAWAAQAPAAAJAGQALgHAOAAQANAAAKAGQAJAFACAHIAHAAQAOAAALAHQAKAGAAAKQAAAFgCACQATAHAAANQAAAJgKAHQgKAGgOAAIgGAAQgBAJgKAHQgKAFgOABQgKAAgJgEQgKALgTAAQgSAAgKgKg");
	this.shape_1.setTransform(11.825,207.2);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#221F20").p("ADGgXQAEgHAAgIQAAgTgUgNQgVgOgdAAIgNABQgFgPgTgLQgTgKgZAAQgfAAgUAOQgUgNgdAAQgUAAgSAHQgQAHgJAMIgIAAQgdAAgUANQgVAOAAASQAAAJAFAJQgWAEgPAMQgPAMAAAOQAAARASANQARANAZACIAAAGQAAATAUANQAVANAdAAQAUAAATgHQAVASAjAAQASAAARgGQAQgGAJgKQARAHAVAAQAcAAAVgMQAUgNABgSIAMABQAdAAAUgOQAVgNAAgTQAAgNgLgKQgLgLgSgGg");
	this.shape_2.setTransform(60.875,181.175);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AhEBmQgTAHgUAAQgdAAgVgNQgUgNAAgTIAAgGQgZgCgRgNQgSgNAAgRQAAgOAPgMQAPgMAWgEQgFgJAAgJQAAgSAVgOQAUgNAdAAIAIAAQAJgMAQgHQASgHAUAAQAdAAAUANQAUgOAfAAQAZAAATAKQATALAFAPIANgBQAdAAAVAOQAUANAAATQAAAIgEAHQASAGALALQALAKAAANQAAATgVANQgUAOgdAAIgMgBQgBASgUANQgVAMgcAAQgVAAgRgHQgJAKgQAGQgRAGgSAAQgjAAgVgSg");
	this.shape_3.setTransform(60.875,181.175);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	// Layer_1
	this.instance = new lib.CachedBmp_25();
	this.instance.setTransform(59.4,61.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#221F20").p("ARVifQAYgyAAg2QAAh/hzhYQhzhaijAAQglAAgjAFQgbhphshFQhshGiNAAQhUAAhLAaQhJAag1AsQg3gphGgXQhIgXhQAAQhzAAhhAxQhfAvgwBPQgTgDgYAAQiiAAhzBaQhzBZAAB+QAAA9AeA3QiAAahSBSQhTBSAABoQAABzBhBWQBfBUCPARQgDARAAAUQAAB/B0BZQByBZCjAAQB3AABkg0QA3A7BSAiQBVAiBgAAQBpAABcgpQBYgpA0hEQBjAxB0AAQCeAAByhVQByhVAGh6QAdAEAkAAQCiAABzhZQBzhZAAh/QAAhZg+hKQg8hJhlglgAAbDKIAOAJIgTgEg");
	this.shape_4.setTransform(133.225,80.775);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("Aj6MGQhSgig3g7QhkA0h3AAQijAAhyhZQh0hZAAh/QAAgUADgRQiPgRhfhUQhhhWAAhzQAAhoBThSQBShSCAgaQgeg3AAg9QAAh+BzhZQBzhaCiAAQAYAAATADQAwhPBfgvQBhgxBzAAQBQAABIAXQBGAXA3ApQA1gsBJgaQBLgaBUAAQCNAABsBGQBsBFAbBpQAjgFAlAAQCjAABzBaQBzBYAAB/QAAA2gYAyQBlAlA8BJQA+BKAABZQAAB/hzBZQhzBZiiAAQgkAAgdgEQgGB6hyBVQhyBVieAAQh0AAhjgxQg0BEhYApQhcAphpAAQhgAAhVgigAApDTIgOgJIgFAFIATAEg");
	this.shape_5.setTransform(133.225,80.775);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_5},{t:this.shape_4}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,268.5,215.2);


(lib.בלובלובלו = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_23();
	this.instance.setTransform(236.65,159.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.instance_1 = new lib.CachedBmp_24();
	this.instance_1.setTransform(186.4,86,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(186.4,86,267.5,214);


(lib.איזהכיף = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_22();
	this.instance.setTransform(-52.1,10.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#221F20").p("AJyhLQAOgYAAgYQAAg8hBgqQhBgqhcAAQgSAAgXADQgPgyg9ggQg9ghhQAAQgvAAgqAMQgpAMgeAVQhBgphbAAQhBAAg3AXQg1AWgbAlIgZgBQhbAAhBAqQhBAqAAA7QAAAdARAaQhIAMgvAnQgvAmAAAxQAAA2A3AoQA2AoBRAIQgCAJAAAJQAAA7BBAqQBBAqBbAAQBDAAA5gYQAfAbAuAQQAwAQA3AAQA7AAAzgTQAygTAeghQA2AYBDAAQBZAABAgoQBAgoAEg6QAYACANAAQBbAABBgqQBBgqAAg7QAAgqgjgjQgigig5gSg");
	this.shape.setTransform(143.3073,16.6631,1.1942,1.1942);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AiNFsQgugQgfgbQg5AYhDAAQhbAAhBgqQhBgqAAg7IACgSQhRgIg2goQg3goAAg2QAAgxAvgmQAvgnBIgMQgRgaAAgdQAAg7BBgqQBBgqBbAAIAZABQAbglA1gWQA3gXBBAAQBbAABBApQAegVApgMQAqgMAvAAQBQAAA9AhQA9AgAPAyQAXgDASAAQBcAABBAqQBBAqAAA8QAAAYgOAYQA5ASAiAiQAjAjAAAqQAAA7hBAqQhBAqhbAAIglgCQgEA6hAAoQhAAohZAAQhDAAg2gYQgeAhgyATQgzATg7AAQg3AAgwgQg");
	this.shape_1.setTransform(143.3073,16.6631,1.1942,1.1942);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-52.1,-29.7,286.2,118.7);


(lib.איזהיופיבאת = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_20();
	this.instance.setTransform(64.75,-13.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.instance_1 = new lib.CachedBmp_21();
	this.instance_1.setTransform(39.3,-67.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(39.3,-67.5,267.5,214);


(lib.אאא = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_19();
	this.instance.setTransform(46.05,40.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#221F20").p("AL9DzQBIg3Amg/QAohBAAhDQAAhdhIhVQhGhSh+g/QkMiGl7AAQl6AAkMCGQh+A/hGBSQhIBVAABdQAABcBIBVQBGBSB+A/QEMCGF6AAQCqAACdgeQCYgdB7g1QArArBxA0QBzA1gGgfQgFgegohSQgohRgRgSg");
	this.shape.setTransform(91.475,46.547);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AL2GwQhxg0grgrQh7A1iYAdQidAeiqAAQl6AAkMiGQh+g/hGhSQhIhVAAhcQAAhdBIhVQBGhSB+g/QEMiGF6AAQF7AAEMCGQB+A/BGBSQBIBVAABdQAABDgoBBQgmA/hIA3QARASAoBRQAoBSAFAeQACALgOAAQgYAAhJghg");
	this.shape_1.setTransform(91.475,46.547);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,185,97.9);


(lib.רגלייםימיןאחורה = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_18();
	this.instance.setTransform(-0.15,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.1,0,284,412);


(lib.רגלייםימיןקדימה = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_17();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,208,408.5);


(lib.רגלשמאל = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#4184A3").s().p("AhpM1IgXsZQgQh+gJipQgRlTAljWIEkAiIgVEGQgbE0gkDnQgCASgUFNQgUFHgVCAg");
	this.shape.setTransform(32.3985,167.0208,2.0352,2.0352);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,64.8,334.1);


(lib.רגלימין = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#2D6898").s().p("AghNQIgYj5QgOiYgEhhQgMkRA7hIQhljtgRkfQgFhaAEhUIAFhCQBagpCLgvQAeCqAUF4QAKC8ADCZIhDMog");
	this.shape.setTransform(30.5653,172.5256,2.0352,2.0352);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,61.1,345.1);


(lib.פרצוףמופתע = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_14();
	this.instance.setTransform(-0.05,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,107,152);


(lib.חיוךמלא = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_12();
	this.instance.setTransform(-0.05,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,118.5,143);


(lib.חיוךחמוד = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_11();
	this.instance.setTransform(-0.05,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,118.5,143);


(lib.נעלשמאל = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_10();
	this.instance.setTransform(-0.5,-0.75,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.7,55,64);


(lib.נעלימין = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_9();
	this.instance.setTransform(-0.4,-0.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,-0.5,90.5,65);


(lib.ידשמאל = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_8();
	this.instance.setTransform(-0.1,-0.05,0.3769,0.3769);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.1,0,114.19999999999999,234.4);


(lib.ידימין = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#F3B289").s().p("AhvDyQgfhxABhXQAMhcBgjkIBejSQAxAnAVBYQALAtAAAkQgeBJg5B7Qg3B6gPAkIBLF0QgUAagQAHQgMAHgfADQg9h/gfh4g");
	this.shape.setTransform(28.3575,99.1333,2.0332,2.0332);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F3B289").s().p("AgEBYIghgvQAcBHgJgBQgSAAgqhNQguhRAEgyIAbgSQAdgRALACIAWAGQAaAIAPALIBGAuQAOAJgJAIQgJAHgQgEQgTgFgOgJIgJgHIAuAwQAvAyAIAUQAIASgdgVIg/gzIAjA1QAhA2gFAMQgGAQgug2Igsg5IAYAyQAVAygIADIgBAAQgJAAghgrg");
	this.shape_1.setTransform(49.0583,215.2471,2.0341,2.0341);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.3,74.2,242.3);


(lib.בטן = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_7();
	this.instance.setTransform(-0.1,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.1,0,114.5,232.5);


(lib.אגן = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#4184A3").s().p("Ai9CGIgkgGQglh8AciPIHgAAQACAngPAqQgZBDhBA0QhfBLiRAEIgMAAQgoAAgogGg");
	this.shape.setTransform(50.0338,28.3243,2.0347,2.0347);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.1,-0.1,100.3,56.9);


(lib.כפתור2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_59();
	this.instance.setTransform(11.1,6.5,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_58copy2();
	this.instance_1.setTransform(-0.5,-0.5,0.5,0.5);

	this.instance_2 = new lib.againG("synched",0);
	this.instance_2.setTransform(107.8,43.6,1,1,0,0,0,107.8,43.6);
	this.instance_2.alpha = 0.5508;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.5,-0.5,216.5,88.5);


(lib.botton_play = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_51();
	this.instance.setTransform(28.35,18.15,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_54();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.instance_2 = new lib.playG("synched",0);
	this.instance_2.setTransform(96,52,1,1,0,0,0,96,52);
	this.instance_2.alpha = 0.5508;

	this.instance_3 = new lib.CachedBmp_53();
	this.instance_3.setTransform(28.35,18.15,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_55();
	this.instance_4.setTransform(28.35,18.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_1},{t:this.instance_3}]},1).to({state:[{t:this.instance_1},{t:this.instance_4}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,192,104);


(lib.פיות = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_45();
	this.instance.setTransform(0,0,0.4686,0.4686);

	this.instance_1 = new lib.פהמופתע("synched",0);
	this.instance_1.setTransform(24.1,16.95,1,1,0,0,0,14.8,22.9);

	this.instance_2 = new lib.פה2("synched",0);
	this.instance_2.setTransform(26.9,17.05,1,1,0,0,0,26.9,18.2);

	this.instance_3 = new lib.פה3("synched",0);
	this.instance_3.setTransform(27.8,11.05,1,1,0,0,0,28.7,12.2);

	this.instance_4 = new lib.פה11("single",0);
	this.instance_4.setTransform(27.9,14.45,1.3149,1.3149,0,0,0,21.7,6.2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.9,-5.9,57.699999999999996,45.9);


(lib.גבות1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.גבות2("synched",0);
	this.instance.setTransform(24.35,5.5,1.2064,1.3895,0,0,0,25.6,4.8);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({_off:false},0).to({_off:true},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-6.5,-1.1,62,13.2);


(lib.בקבוק = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_4 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("ABnBjQgcgpAAg6QAAg5AcgpQAcgpAngBQAnABAbApQAcApgBA5QABA6gcApQgbApgnAAQgnAAgcgpgAjrBjQgbgpAAg6QAAg5AbgpQAbgpAngBQAoABAbApQAcApAAA5QAAA6gcApQgbApgoAAQgnAAgbgpg");
	mask.setTransform(40,68.6);

	// Layer_5
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#A7A9AB").s().p("AAfAlIAAhJIEHAAIAABJQh/g+iIA+gAklAlIAAhJIEHAAIAABJQh/g+iIA+g");
	this.shape.setTransform(39.6,50.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#A7A9AB").s().p("AAkAlIAAhJIEHAAIAABJQh/g+iIA+gAkqAlIAAhJIEHAAIAABJQh/g+iIA+g");
	this.shape_1.setTransform(40.075,50.8);
	this.shape_1._off = true;

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#A7A9AB").s().p("AAkA/IAAh9IEHAAIAAB+Qh7gZiMAYgAkqA/IAAh9IEHAAIAAB+Qh7gZiMAYg");
	this.shape_2.setTransform(40.05,53.4);
	this.shape_2._off = true;

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#A7A9AB").s().p("AAkBUIAAiwIEGAAIAACyQg4AHg9AAQhFAAhMgJgAkpBUIAAiwIEGAAIAACyQg4AHg9AAQhFAAhMgJg");
	this.shape_3.setTransform(40.025,56.3516);
	this.shape_3._off = true;

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#A7A9AB").s().p("AAkBjIAAjjIEGAAIAADmQg4AbhAAAQhDAAhLgegAkpBjIAAjjIEHAAIAADmQg5Abg/AAQhDAAhMgeg");
	this.shape_4.setTransform(40,59.901);
	this.shape_4._off = true;

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#A7A9AB").s().p("AAjBzIAAkWIEHAAIAAEaQg3AthAAAQhDAAhNgxgAkpBzIAAkWIEHAAIAAEaQg3AthAAAQhDAAhNgxg");
	this.shape_5.setTransform(39.975,63.4636);
	this.shape_5._off = true;

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#A7A9AB").s().p("AAjCCIAAlJIEGAAIAAFOQg0BBhBAAQhCAAhPhGgAkpCCIAAlJIEHAAIAAFOQg1BBhAAAQhDAAhPhGg");
	this.shape_6.setTransform(39.95,67.0262);
	this.shape_6._off = true;

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#A7A9AB").s().p("AAfCCIAAlJIEHAAIAAFOQg1BBhAAAQhDAAhPhGgAklCCIAAlJIEHAAIAAFOQg2BBhAAAQhCAAhPhGg");
	this.shape_7.setTransform(39.6,67.0262);
	this.shape_7._off = true;

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#A7A9AB").s().p("AAgB1IAAkeIEGAAIAAEiQg2AxhAAAQhDAAhNg1gAklB1IAAkeIEGAAIAAEiQg2AxhAAAQhDAAhNg1g");
	this.shape_8.setTransform(39.625,64.051);
	this.shape_8._off = true;

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#A7A9AB").s().p("AAgBpIAAj0IEHAAIAAD3Qg4AghAAAQhDAAhMgjgAkmBpIAAj0IEHAAIAAD3Qg4Agg/AAQhDAAhNgjg");
	this.shape_9.setTransform(39.65,61.0949);
	this.shape_9._off = true;

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#A7A9AB").s().p("AAgBcIAAjKIEHAAIAADMQg5ARg/AAQhEAAhLgTgAkmBcIAAjKIEHAAIAADMQg5ARg/AAQhDAAhMgTg");
	this.shape_10.setTransform(39.675,58.1323);
	this.shape_10._off = true;

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#A7A9AB").s().p("AAgBPIAAifIEHAAIAACgIhbABQhRAAhbgCgAkmBPIAAifIEHAAIAACgIhbABQhRAAhbgCg");
	this.shape_11.setTransform(39.675,55.1614);
	this.shape_11._off = true;

	this.shape_12 = new cjs.Shape();
	this.shape_12.graphics.f("#A7A9AB").s().p("AAgA6IAAh0IEHAAIAAB1Qh7geiMAdgAkmA6IAAh0IEHAAIAAB1Qh8geiLAdg");
	this.shape_12.setTransform(39.7,52.975);
	this.shape_12._off = true;

	this.shape_13 = new cjs.Shape();
	this.shape_13.graphics.f("#A7A9AB").s().p("AAhAlIAAhJIEGAAIAABJQh+g+iIA+gAkmAlIAAhJIEGAAIAABJQh+g+iIA+g");
	this.shape_13.setTransform(39.725,50.8);
	this.shape_13._off = true;

	var maskedShapeInstanceList = [this.shape,this.shape_1,this.shape_2,this.shape_3,this.shape_4,this.shape_5,this.shape_6,this.shape_7,this.shape_8,this.shape_9,this.shape_10,this.shape_11,this.shape_12,this.shape_13];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.shape).to({_off:true},7).wait(83).to({_off:false},0).to({_off:true},7).wait(52).to({_off:false},0).to({_off:true},7).wait(82).to({_off:false},0).to({_off:true},7).wait(54).to({_off:false},0).to({_off:true},7).wait(77).to({_off:false},0).to({_off:true},7).wait(59).to({_off:false},0).to({_off:true},7).wait(51).to({_off:false},0).to({_off:true},7).wait(59).to({_off:false},0).to({_off:true},7).wait(25));
	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(7).to({_off:false},0).to({_off:true},1).wait(89).to({_off:false},0).to({_off:true},1).wait(58).to({_off:false},0).to({_off:true},1).wait(88).to({_off:false},0).to({_off:true},1).wait(60).to({_off:false},0).to({_off:true},1).wait(83).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(57).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(24));
	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(8).to({_off:false},0).to({_off:true},1).wait(89).to({_off:false},0).to({_off:true},1).wait(58).to({_off:false},0).to({_off:true},1).wait(88).to({_off:false},0).to({_off:true},1).wait(60).to({_off:false},0).to({_off:true},1).wait(83).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(57).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(23));
	this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(9).to({_off:false},0).to({_off:true},1).wait(89).to({_off:false},0).to({_off:true},1).wait(58).to({_off:false},0).to({_off:true},1).wait(88).to({_off:false},0).to({_off:true},1).wait(60).to({_off:false},0).to({_off:true},1).wait(83).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(57).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(22));
	this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(10).to({_off:false},0).to({_off:true},1).wait(89).to({_off:false},0).to({_off:true},1).wait(58).to({_off:false},0).to({_off:true},1).wait(88).to({_off:false},0).to({_off:true},1).wait(60).to({_off:false},0).to({_off:true},1).wait(83).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(57).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(21));
	this.timeline.addTween(cjs.Tween.get(this.shape_5).wait(11).to({_off:false},0).to({_off:true},1).wait(89).to({_off:false},0).to({_off:true},1).wait(58).to({_off:false},0).to({_off:true},1).wait(88).to({_off:false},0).to({_off:true},1).wait(60).to({_off:false},0).to({_off:true},1).wait(83).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(57).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(20));
	this.timeline.addTween(cjs.Tween.get(this.shape_6).wait(12).to({_off:false},0).to({_off:true},2).wait(88).to({_off:false},0).to({_off:true},2).wait(57).to({_off:false},0).to({_off:true},2).wait(87).to({_off:false},0).to({_off:true},2).wait(59).to({_off:false},0).to({_off:true},2).wait(82).to({_off:false},0).to({_off:true},2).wait(64).to({_off:false},0).to({_off:true},2).wait(56).to({_off:false},0).to({_off:true},2).wait(64).to({_off:false},0).to({_off:true},2).wait(18));
	this.timeline.addTween(cjs.Tween.get(this.shape_7).wait(14).to({_off:false},0).to({_off:true},1).wait(89).to({_off:false},0).to({_off:true},1).wait(58).to({_off:false},0).to({_off:true},1).wait(88).to({_off:false},0).to({_off:true},1).wait(60).to({_off:false},0).to({_off:true},1).wait(83).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(57).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(17));
	this.timeline.addTween(cjs.Tween.get(this.shape_8).wait(15).to({_off:false},0).to({_off:true},1).wait(89).to({_off:false},0).to({_off:true},1).wait(58).to({_off:false},0).to({_off:true},1).wait(88).to({_off:false},0).to({_off:true},1).wait(60).to({_off:false},0).to({_off:true},1).wait(83).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(57).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(16));
	this.timeline.addTween(cjs.Tween.get(this.shape_9).wait(16).to({_off:false},0).to({_off:true},1).wait(89).to({_off:false},0).to({_off:true},1).wait(58).to({_off:false},0).to({_off:true},1).wait(88).to({_off:false},0).to({_off:true},1).wait(60).to({_off:false},0).to({_off:true},1).wait(83).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(57).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(15));
	this.timeline.addTween(cjs.Tween.get(this.shape_10).wait(17).to({_off:false},0).to({_off:true},1).wait(89).to({_off:false},0).to({_off:true},1).wait(58).to({_off:false},0).to({_off:true},1).wait(88).to({_off:false},0).to({_off:true},1).wait(60).to({_off:false},0).to({_off:true},1).wait(83).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(57).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(14));
	this.timeline.addTween(cjs.Tween.get(this.shape_11).wait(18).to({_off:false},0).to({_off:true},1).wait(89).to({_off:false},0).to({_off:true},1).wait(58).to({_off:false},0).to({_off:true},1).wait(88).to({_off:false},0).to({_off:true},1).wait(60).to({_off:false},0).to({_off:true},1).wait(83).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(57).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(13));
	this.timeline.addTween(cjs.Tween.get(this.shape_12).wait(19).to({_off:false},0).to({_off:true},1).wait(89).to({_off:false},0).to({_off:true},1).wait(58).to({_off:false},0).to({_off:true},1).wait(88).to({_off:false},0).to({_off:true},1).wait(60).to({_off:false},0).to({_off:true},1).wait(83).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(57).to({_off:false},0).to({_off:true},1).wait(65).to({_off:false},0).to({_off:true},1).wait(12));
	this.timeline.addTween(cjs.Tween.get(this.shape_13).wait(20).to({_off:false},0).to({_off:true},70).wait(20).to({_off:false},0).to({_off:true},39).wait(20).to({_off:false},0).to({_off:true},69).wait(20).to({_off:false},0).to({_off:true},41).wait(20).to({_off:false},0).to({_off:true},64).wait(20).to({_off:false},0).to({_off:true},46).wait(20).to({_off:false},0).to({_off:true},38).wait(20).to({_off:false},0).to({_off:true},46).wait(20).to({_off:false},0).wait(12));

	// Layer_7
	this.instance = new lib.אישון2("synched",0);
	this.instance.setTransform(58.5,70.3);

	this.instance_1 = new lib.אישון2("synched",0);
	this.instance_1.setTransform(23.7,70.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1,p:{x:23.7,y:70.3}},{t:this.instance,p:{x:58.5,y:70.3}}]}).to({state:[{t:this.instance_1,p:{x:20.7,y:66.35}},{t:this.instance,p:{x:55.5,y:66.35}}]},90).wait(515));

	// עין2
	this.shape_14 = new cjs.Shape();
	this.shape_14.graphics.f().s("#000000").ss(1,1,1).p("ABeAAQAAA6gbApQgcAqgnAAQgmAAgbgqQgcgpAAg6QAAg5AcgpQAbgpAmAAQAnAAAcApQAbApAAA5g");
	this.shape_14.setTransform(56.95,68.6);

	this.timeline.addTween(cjs.Tween.get(this.shape_14).wait(605));

	// עין1
	this.shape_15 = new cjs.Shape();
	this.shape_15.graphics.f().s("#000000").ss(1,1,1).p("ABeAAQAAA6gcApQgbAqgnAAQgmAAgcgqQgbgpAAg6QAAg5AbgpQAcgpAmAAQAnAAAbApQAcApAAA5g");
	this.shape_15.setTransform(23.05,68.6);

	this.timeline.addTween(cjs.Tween.get(this.shape_15).wait(605));

	// בקבוק
	this.instance_2 = new lib.CachedBmp_34();
	this.instance_2.setTransform(-0.6,7,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_35();
	this.instance_3.setTransform(-0.6,7,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_36();
	this.instance_4.setTransform(-0.6,7,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_37();
	this.instance_5.setTransform(-0.6,7,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_38();
	this.instance_6.setTransform(-0.6,7,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_39();
	this.instance_7.setTransform(-0.6,7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2}]}).to({state:[{t:this.instance_3}]},248).to({state:[{t:this.instance_4}]},5).to({state:[{t:this.instance_5}]},6).to({state:[{t:this.instance_6}]},6).to({state:[{t:this.instance_7}]},7).wait(333));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.6,7,80,216.5);


(lib.לאא = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Tween5("synched",0,false);
	this.instance.setTransform(244,81.55);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regY:0.1,scaleX:1.0437,scaleY:1.0437,y:81.65},0).wait(1).to({scaleX:1.0874,scaleY:1.0874},0).wait(1).to({scaleX:1.1311,scaleY:1.1311},0).wait(1).to({scaleX:1.1748,scaleY:1.1748},0).wait(1).to({scaleX:1.2185,scaleY:1.2185},0).wait(1).to({scaleX:1.2622,scaleY:1.2622,y:81.7},0).wait(1).to({scaleX:1.3059,scaleY:1.3059},0).wait(1).to({scaleX:1.3497,scaleY:1.3497},0).wait(1).to({scaleX:1.3934,scaleY:1.3934},0).wait(1).to({scaleX:1.4371,scaleY:1.4371},0).wait(1).to({scaleX:1.4808,scaleY:1.4808},0).wait(1).to({scaleX:1.5135,scaleY:1.5135},0).wait(1).to({scaleX:1.5463,scaleY:1.5463},0).wait(1).to({scaleX:1.5791,scaleY:1.5791},0).wait(1).to({scaleX:1.6119,scaleY:1.6119},0).wait(1).to({scaleX:1.6447,scaleY:1.6447},0).wait(1).to({scaleX:1.6774,scaleY:1.6774},0).wait(1).to({scaleX:1.7102,scaleY:1.7102},0).wait(1).to({scaleX:1.743,scaleY:1.743},0).wait(1).to({scaleX:1.7758,scaleY:1.7758,y:81.75},0).wait(1).to({scaleX:1.8086,scaleY:1.8086},0).wait(1).to({scaleX:1.8413,scaleY:1.8413},0).wait(1).to({scaleX:1.8741,scaleY:1.8741},0).wait(1).to({scaleX:1.9069,scaleY:1.9069},0).wait(1).to({scaleX:1.9397,scaleY:1.9397},0).wait(1).to({scaleX:1.9725,scaleY:1.9725},0).wait(1).to({scaleX:2.0052,scaleY:2.0052},0).wait(1).to({scaleX:2.038,scaleY:2.038},0).wait(1).to({scaleX:2.0708,scaleY:2.0708},0).wait(1).to({scaleX:2.1036,scaleY:2.1036},0).wait(1).to({scaleX:2.1364,scaleY:2.1364},0).wait(1).to({scaleX:2.1516,scaleY:2.1516},0).wait(1).to({scaleX:2.1668,scaleY:2.1668},0).wait(1).to({scaleX:2.1821,scaleY:2.1821},0).wait(1).to({scaleX:2.1973,scaleY:2.1973},0).wait(1).to({scaleX:2.2125,scaleY:2.2125},0).wait(1).to({scaleX:2.2278,scaleY:2.2278},0).wait(1).to({scaleX:2.243,scaleY:2.243},0).wait(1).to({scaleX:2.2582,scaleY:2.2582,y:81.8},0).wait(1).to({scaleX:2.2735,scaleY:2.2735},0).wait(1).to({scaleX:2.2887,scaleY:2.2887},0).wait(1).to({scaleX:2.3039,scaleY:2.3039},0).wait(1).to({scaleX:2.3192,scaleY:2.3192},0).wait(1).to({scaleX:2.3344,scaleY:2.3344},0).wait(1).to({scaleX:2.3496,scaleY:2.3496},0).wait(1).to({scaleX:2.3649,scaleY:2.3649},0).wait(1).to({scaleX:2.3801,scaleY:2.3801},0).wait(1).to({scaleX:2.3954,scaleY:2.3954},0).wait(1).to({scaleX:2.4106,scaleY:2.4106},0).wait(1).to({scaleX:2.4258,scaleY:2.4258},0).wait(1).to({scaleX:2.4411,scaleY:2.4411},0).wait(1).to({scaleX:2.4563,scaleY:2.4563},0).wait(1).to({scaleX:2.4715,scaleY:2.4715},0).wait(1).to({scaleX:2.4868,scaleY:2.4868},0).wait(1).to({scaleX:2.502,scaleY:2.502},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(3));

	// Layer_1
	this.instance_1 = new lib.CachedBmp_29();
	this.instance_1.setTransform(81.8,-18.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(61).to({_off:true},1).wait(3));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-18.4,404.3,258);


(lib.רגליים = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.אגן("single",0);
	this.instance.setTransform(64.85,18.2,1,1,0,0,0,60,18.2);

	this.instance_1 = new lib.נעלשמאל("single",0);
	this.instance_1.setTransform(55.7,345.1,1,1,0,0,0,54.7,14.2);

	this.instance_2 = new lib.רגלשמאל("single",0);
	this.instance_2.setTransform(27.8,204.55,1,1,0,0,0,27.8,186.3);

	this.instance_3 = new lib.נעלימין("single",0);
	this.instance_3.setTransform(73.9,326.15);

	this.instance_4 = new lib.רגלימין("single",0);
	this.instance_4.setTransform(102.8,182.5,1,1,0,0,0,47.1,182.5);

	this.instance_5 = new lib.רגלייםימיןקדימה("synched",0);
	this.instance_5.setTransform(85.8,204.3,1,1,0,0,0,104,204.3);

	this.instance_6 = new lib.רגלייםימיןאחורה("synched",0);
	this.instance_6.setTransform(142.2,206.3,1,1,0,0,0,142.2,206.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-18.2,-0.1,302.09999999999997,412.1);


(lib.ראש = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_16();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.חיוךמלא("synched",0);
	this.instance_1.setTransform(59.15,71.5,1,1,0,0,0,59.1,71.5);

	this.instance_2 = new lib.פרצוףמופתע("synched",0);
	this.instance_2.setTransform(53.6,76.1,1,1,0,0,0,53.6,76.1);

	this.instance_3 = new lib.חיוךחמוד("synched",0);
	this.instance_3.setTransform(59.1,71.5,1,1,0,0,0,59.1,71.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[]},1).to({state:[{t:this.instance_2}]},1).to({state:[]},1).to({state:[{t:this.instance_3}]},1).to({state:[]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,118.5,152);


// stage content:
(lib.גורלהבקבוקסופי1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,660];
	this.streamSoundSymbolsList[0] = [{id:"SUOND4wav",startFrame:0,endFrame:900,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var soundInstance = playSound("SUOND4wav",0);
		this.InsertIntoSoundStreamData(soundInstance,0,900,1);
		this.stop();
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.btnbtn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay(1);
		});
	}
	this.frame_660 = function() {
		this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.btnbtn2.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay(1);
		});
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(660).call(this.frame_660).wait(604));

	// bottonplay
	this.btnbtn = new lib.botton_play();
	this.btnbtn.name = "btnbtn";
	this.btnbtn.setTransform(231.95,164.75);
	new cjs.ButtonHelper(this.btnbtn, 0, 1, 2, false, new lib.botton_play(), 3);

	this.btnbtn2 = new lib.כפתור2();
	this.btnbtn2.name = "btnbtn2";
	this.btnbtn2.setTransform(325.95,238.65,1,1,0,0,0,107.8,43.6);
	new cjs.ButtonHelper(this.btnbtn2, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.btnbtn}]}).to({state:[]},1).to({state:[{t:this.btnbtn2}]},659).wait(604));

	// בלובלובלו
	this.instance = new lib.בלובלובלו("synched",0);
	this.instance.setTransform(1238.4,333.2,1,1,0,0,0,126,192.5);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(29).to({_off:false},0).to({_off:true},46).wait(1189));

	// יום_יפה_לשתות_מים
	this.instance_1 = new lib.יוםיפהלשתותמים("synched",0);
	this.instance_1.setTransform(1429.65,308.8,1,1,0,0,0,133.2,80.8);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(75).to({_off:false},0).to({_off:true},55).wait(1134));

	// באת_לשתות_מים
	this.instance_2 = new lib.איזהיופיבאת("synched",0);
	this.instance_2.setTransform(1376.7,340.3,1,1,0,0,0,120.3,60.8);
	this.instance_2._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(130).to({_off:false},0).to({_off:true},60).wait(1074));

	// איזה_כיף
	this.instance_3 = new lib.איזהכיף("synched",0);
	this.instance_3.setTransform(1428,452.8,1,1,0,0,0,75.2,38);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(172).to({_off:false},0).to({_off:true},32).wait(1060));

	// לפתוח_קודם
	this.instance_4 = new lib.לפתוחקודם("synched",0);
	this.instance_4.setTransform(1412.45,252.95,1,1,0,0,0,133.2,65);
	this.instance_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(204).to({_off:false},0).to({_off:true},41).wait(1019));

	// לאאא
	this.instance_5 = new lib.לאא("synched",0);
	this.instance_5.setTransform(1392.65,351.7,1,1,0,0,0,131.7,71.9);
	this.instance_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(274).to({_off:false},0).to({_off:true},62).wait(928));

	// למה_את_זורקת_את_הפקק
	this.instance_6 = new lib.למהה("synched",0);
	this.instance_6.setTransform(1276.6,33.4,1,1,0,0,0,172.2,277.6);
	this.instance_6._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(293).to({_off:false},0).to({_off:true},43).wait(928));

	// אאאא
	this.instance_7 = new lib.אאא("synched",0);
	this.instance_7.setTransform(924.2,342.9,1,1,0,0,0,91.5,48.2);
	this.instance_7._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(344).to({_off:false},0).to({_off:true},63).wait(857));

	// לא_לפח
	this.instance_8 = new lib.לאלפח("synched",0);
	this.instance_8.setTransform(1773.2,333.55,1,1,0,0,0,122.4,52.7);
	this.instance_8._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(434).to({_off:false},0).to({x:1802.55,y:333.5},8).to({_off:true},47).wait(775));

	// למלא_אותי
	this.instance_9 = new lib.הייתיכולה("synched",0);
	this.instance_9.setTransform(1711.4,364.5,1,1,0,0,0,147,63.4);
	this.instance_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(489).to({_off:false},0).to({_off:true},55).wait(720));

	// למחזר
	this.instance_10 = new lib.למחזר("synched",0);
	this.instance_10.setTransform(1711,362.75,1,1,0,0,0,193.3,83.2);
	this.instance_10._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(543).to({_off:false},0).to({_off:true},87).wait(634));

	// פח
	this.instance_11 = new lib.עיניפח("synched",0);
	this.instance_11.setTransform(1736.2,759.5,1,1,0,0,0,48.1,13.6);

	this.instance_12 = new lib.CachedBmp_70();
	this.instance_12.setTransform(1704.75,607.75,0.5,0.5);

	this.instance_13 = new lib.CachedBmp_1();
	this.instance_13.setTransform(1648.95,594.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_13},{t:this.instance_12},{t:this.instance_11}]}).to({state:[]},1235).wait(29));

	// יד_ימין
	this.ikNode_2 = new lib.ידימין("synched",0);
	this.ikNode_2.name = "ikNode_2";
	this.ikNode_2.setTransform(-279.5,558.15,1,1,0,0,0,40.8,39.3);

	this.ikNode_1 = new lib.ידימין("synched",0);
	this.ikNode_1.name = "ikNode_1";
	this.ikNode_1.setTransform(1055.1,497.75,0.9999,0.9999,-76.3794,0,0,39.9,40);
	this.ikNode_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.ikNode_2).wait(1).to({x:-278.8,y:557.9},0).wait(1).to({x:-278.15,y:557.6},0).wait(1).to({x:-277.45,y:557.35},0).wait(1).to({x:-276.8,y:557.05},0).wait(1).to({x:-276.1,y:556.8},0).wait(1).to({x:-275.4,y:556.55},0).wait(1).to({x:-274.75,y:556.25},0).wait(1).to({x:-274.05,y:556},0).wait(1).to({x:-273.35,y:555.7},0).wait(1).to({x:-272.7,y:555.45},0).wait(1).to({x:-272,y:555.2},0).wait(1).to({x:-271.35,y:554.9},0).wait(1).to({x:-270.65,y:554.65},0).wait(1).to({x:-269.95,y:554.4},0).wait(1).to({x:-269.3,y:554.1},0).wait(1).to({x:-268.6,y:553.85},0).wait(1).to({x:-267.95,y:553.55},0).wait(1).to({x:-267.25,y:553.3},0).wait(1).to({x:-266.55,y:553.05},0).wait(1).to({x:-265.9,y:552.75},0).wait(1).to({x:-265.2,y:552.5},0).wait(1).to({x:-264.5,y:552.2},0).wait(1).to({x:-263.85,y:551.95},0).wait(1).to({x:-263.15,y:551.7},0).wait(1).to({x:-262.5,y:551.4},0).wait(1).to({x:-261.8,y:551.15},0).wait(1).to({x:-261.1,y:550.85},0).wait(1).to({x:-260.45,y:550.6},0).wait(1).to({x:-259.75,y:550.35},0).wait(1).to({x:-259.1,y:550.05},0).wait(1).to({x:-258.4,y:549.8},0).wait(1).to({x:-257.7,y:549.5},0).wait(1).to({x:-257.05,y:549.25},0).wait(1).to({x:-256.35,y:549},0).wait(1).to({x:-255.65,y:548.7},0).wait(1).to({x:-255,y:548.45},0).wait(1).to({x:-254.3,y:548.2},0).wait(1).to({x:-253.65,y:547.9},0).wait(1).to({x:-252.95,y:547.65},0).wait(1).to({x:-252.25,y:547.35},0).wait(1).to({x:-251.6,y:547.1},0).wait(1).to({x:-250.9,y:546.85},0).wait(1).to({x:-250.2,y:546.55},0).wait(1).to({x:-249.55,y:546.3},0).wait(1).to({x:-248.85,y:546},0).wait(1).to({x:-248.2,y:545.75},0).wait(1).to({x:-247.5,y:545.5},0).wait(1).to({x:-246.8,y:545.2},0).wait(1).to({x:-246.15,y:544.95},0).wait(1).to({x:-245.45,y:544.65},0).wait(1).to({x:-244.8,y:544.4},0).wait(1).to({x:-244.1,y:544.15},0).wait(1).to({x:-243.4,y:543.85},0).wait(1).to({x:-242.75,y:543.6},0).wait(1).to({x:-242.05,y:543.3},0).wait(1).to({x:-241.35,y:543.05},0).wait(1).to({x:-240.7,y:542.8},0).wait(1).to({x:-240,y:542.5},0).wait(1).to({x:-239.35,y:542.25},0).wait(1).to({x:-238.65,y:542},0).wait(1).to({x:-237.95,y:541.7},0).wait(1).to({x:-237.3,y:541.45},0).wait(1).to({x:-236.6,y:541.15},0).wait(1).to({x:-235.95,y:540.9},0).wait(1).to({x:-235.25,y:540.65},0).wait(1).to({x:-234.55,y:540.35},0).wait(1).to({x:-233.9,y:540.1},0).wait(1).to({x:-233.2,y:539.8},0).wait(1).to({x:-232.5,y:539.55},0).wait(1).to({x:-231.85,y:539.3},0).wait(1).to({x:-231.15,y:539},0).wait(1).to({x:-230.5,y:538.75},0).wait(1).to({x:-229.8,y:538.45},0).wait(1).to({x:-229.1,y:538.2},0).wait(1).to({x:-228.45,y:537.95},0).wait(1).to({x:-227.75,y:537.65},0).wait(1).to({x:-227.1,y:537.4},0).wait(1).to({x:-226.4,y:537.1},0).wait(1).to({x:-225.7,y:536.85},0).wait(1).to({x:-225.05,y:536.6},0).wait(1).to({x:-224.35,y:536.3},0).wait(1).to({x:-223.65,y:536.05},0).wait(1).to({x:-223,y:535.75},0).wait(1).to({x:-222.3,y:535.5},0).wait(1).to({x:-221.65,y:535.25},0).wait(1).to({x:-220.95,y:534.95},0).wait(1).to({x:-220.25,y:534.7},0).wait(1).to({x:-219.6,y:534.45},0).wait(1).to({x:-218.9,y:534.15},0).wait(1).to({x:-218.25,y:533.9},0).wait(1).to({x:-217.55,y:533.6},0).wait(1).to({x:-216.85,y:533.35},0).wait(1).to({x:-216.2,y:533.1},0).wait(1).to({x:-215.5,y:532.8},0).wait(1).to({x:-214.8,y:532.55},0).wait(1).to({x:-214.15,y:532.25},0).wait(1).to({x:-213.45,y:532},0).wait(1).to({x:-212.8,y:531.75},0).wait(1).to({x:-212.1,y:531.45},0).wait(1).to({x:-211.4,y:531.2},0).wait(1).to({x:-210.75,y:530.9},0).wait(1).to({x:-210.05,y:530.65},0).wait(1).to({x:-209.35,y:530.4},0).wait(1).to({x:-208.7,y:530.1},0).wait(1).to({x:-208,y:529.85},0).wait(1).to({x:-207.35,y:529.55},0).wait(1).to({x:-206.65,y:529.3},0).wait(1).to({x:-205.95,y:529.05},0).wait(1).to({x:-205.3,y:528.75},0).wait(1).to({x:-204.6,y:528.5},0).wait(1).to({x:-203.95,y:528.25},0).wait(1).to({x:-203.25,y:527.95},0).wait(1).to({x:-202.55,y:527.7},0).wait(1).to({x:-201.9,y:527.4},0).wait(1).to({x:-201.2,y:527.15},0).wait(1).to({x:-200.5,y:526.9},0).wait(1).to({x:-199.85,y:526.6},0).wait(1).to({x:-199.15,y:526.35},0).wait(1).to({x:-198.5,y:526.05},0).wait(1).to({x:-197.8,y:525.8},0).wait(1).to({regX:40.6,regY:39.4,rotation:-3.6613,x:-171.2,y:525.2},0).wait(1).to({rotation:-7.3227,x:-144.45,y:524.5},0).wait(1).to({regX:40.5,regY:39.6,rotation:-10.985,x:-117.55,y:523.7},0).wait(1).to({regX:40.4,rotation:-7.3227,x:-104.95,y:524.4},0).wait(1).to({regX:40.5,rotation:-3.6605,x:-92.2,y:525.1},0).wait(1).to({regX:40.8,regY:39.3,rotation:0,x:-79.6,y:525.8},0).wait(1).to({regX:40.6,regY:39.4,rotation:-3.6613,x:-13.8,y:525.15},0).wait(1).to({rotation:-7.3227,x:52.15,y:524.5},0).wait(1).to({regX:40.5,regY:39.6,rotation:-10.985,x:118.25,y:523.7},0).wait(1).to({regX:40.4,rotation:-7.3227,x:154.2,y:524.45},0).wait(1).to({regY:39.5,rotation:-3.6605,x:190.15,y:525},0).wait(1).to({regX:40.8,regY:39.3,rotation:0,x:226.25,y:525.8},0).wait(1).to({regX:40.6,regY:39.4,rotation:-3.6613,x:259.7,y:525.15},0).wait(1).to({rotation:-7.3227,x:293.25,y:524.5},0).wait(1).to({regX:40.5,regY:39.6,rotation:-10.985,x:327,y:523.7},0).wait(1).to({regX:40.4,rotation:-7.3227,x:359.8,y:524.45},0).wait(1).to({regY:39.5,rotation:-3.6605,x:392.6,y:525},0).wait(1).to({regX:40.8,regY:39.3,rotation:0,x:425.55,y:525.8},0).wait(1).to({regX:40.6,regY:39.4,rotation:-3.6613,x:452.2,y:525.15},0).wait(1).to({rotation:-7.3227,x:479,y:524.4},0).wait(1).to({rotation:-10.985,x:505.9,y:523.5},0).wait(1).to({regX:40.5,regY:39.5,rotation:-7.3227,x:556.6,y:524.4},0).wait(1).to({regY:39.4,rotation:-3.6605,x:607.15,y:525.05},0).wait(1).to({regX:40.8,regY:39.3,rotation:0,x:657.95,y:525.8},0).wait(1).to({regX:40.6,regY:39.4,rotation:-3.6613,x:699.3,y:525.2},0).wait(1).to({rotation:-7.3227,x:740.75,y:524.55},0).wait(1).to({regX:40.4,regY:39.6,rotation:-10.985,x:782.3,y:523.7},0).wait(1).to({regX:40.5,x:811.35,y:523.65},0).wait(1).to({regX:40.4,x:840.15,y:523.55},0).wait(1).to({regX:40.5,regY:39.5,x:869.05,y:523.65},0).wait(1).to({rotation:-7.3227,x:888.2,y:524.4},0).wait(1).to({regY:39.4,rotation:-3.6605,x:907.2,y:525},0).wait(1).to({regX:40.8,regY:39.3,rotation:0,x:926.35,y:525.8},0).wait(1).to({regX:40.6,regY:39.4,rotation:-3.6613,x:958.8,y:525.2},0).wait(1).to({rotation:-7.3227,x:991.35,y:524.55},0).wait(1).to({regX:40.4,regY:39.6,rotation:-10.985,x:1024,y:523.7},0).wait(1).to({rotation:-11.7734,x:1024.7,y:523.75},0).wait(1).to({rotation:-12.5632,x:1025.15,y:523.8},0).wait(1).to({rotation:-13.3518,x:1025.65,y:523.85},0).wait(1).to({rotation:-14.1414,x:1026.15,y:523.95},0).wait(1).to({rotation:-14.9307,x:1026.75},0).wait(1).to({regX:40.5,rotation:-15.7195,x:1027.4,y:524},0).wait(1).to({regX:40.4,rotation:-16.5103,x:1027.85},0).wait(1).to({rotation:-17.298,x:1028.3,y:524.15},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:-18.0893,x:1028.85},0).wait(1).to({scaleX:1,scaleY:1,rotation:-18.8781,x:1029.45,y:524.2},0).wait(1).to({rotation:-19.6673,x:1029.9,y:524.3},0).wait(1).to({rotation:-20.4559,x:1030.45,y:524.35},0).wait(1).to({rotation:-21.2462,x:1031},0).wait(1).to({rotation:-22.0362,x:1031.5,y:524.45},0).wait(1).to({rotation:-22.8253,x:1032.05},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:-23.6156,x:1032.5,y:524.55},0).wait(1).to({rotation:-24.405,x:1033.1,y:524.6},0).wait(1).to({regY:39.7,rotation:-25.1948,x:1033.6,y:524.75},0).wait(1).to({regX:40.3,regY:39.6,scaleX:1,scaleY:1,rotation:-25.984,x:1033.95,y:524.65},0).wait(1).to({regX:40.4,rotation:-29.6249,x:1036.3,y:522.6},0).wait(1).to({regX:40.3,regY:39.8,scaleX:0.9999,scaleY:0.9999,rotation:-33.2655,x:1038.65,y:520.75},0).wait(1).to({regX:40.2,rotation:-36.9082,x:1040.85,y:518.6},0).wait(1).to({regX:40.4,rotation:-40.5502,x:1043.25,y:516.45},0).wait(1).to({regX:40.2,regY:39.6,rotation:-44.1913,x:1045.25,y:514.2},0).wait(1).to({rotation:-47.9412,x:1046.45,y:512.6},0).wait(1).to({rotation:-51.6911,x:1047.45,y:511.05},0).wait(1).to({rotation:-55.4408,x:1048.55,y:509.4},0).wait(1).to({regX:40.1,regY:39.9,rotation:-59.191,x:1049.65,y:507.75},0).wait(1).to({regY:39.8,rotation:-63.4873,x:1051,y:505.25},0).wait(1).to({rotation:-67.7854,x:1052.4,y:502.8},0).wait(1).to({rotation:-72.0824,x:1053.75,y:500.2},0).to({_off:true},1).wait(1076));
	this.timeline.addTween(cjs.Tween.get(this.ikNode_1).wait(188).to({_off:false},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({rotation:-85.0907,y:497.7},0).wait(1).to({rotation:-85.0012,x:1055.35},0).wait(1).to({regY:40.1,rotation:-84.9116,x:1055.4,y:497.65},0).wait(1).to({regY:40,rotation:-84.822,x:1055.35,y:497.55},0).wait(1).to({rotation:-84.7325,x:1055.4,y:497.5},0).wait(1).to({regX:39.8,rotation:-84.6421,x:1055.35,y:497.65},0).wait(1).to({regX:39.9,regY:40.1,rotation:-84.5526,x:1055.5,y:497.45},0).wait(1).to({regX:39.8,regY:40,rotation:-84.4621,x:1055.45},0).wait(1).to({rotation:-84.3733,x:1055.5,y:497.35},0).wait(1).to({rotation:-84.2828,x:1055.55},0).wait(1).to({regY:40.1,rotation:-84.1941,x:1055.7,y:497.3},0).wait(1).to({regY:40,rotation:-84.1044,x:1055.6,y:497.25},0).wait(1).to({regX:39.9,rotation:-84.0147,x:1055.65,y:497},0).wait(1).to({regX:39.8,rotation:-83.925,y:497.1},0).wait(1).to({rotation:-83.8354,x:1055.6,y:497.05},0).wait(1).to({rotation:-83.7456,x:1055.7,y:497},0).wait(1).to({regX:39.9,rotation:-83.6566,x:1055.8,y:496.85},0).wait(1).to({regX:39.8,rotation:-83.5661,x:1055.85,y:496.9},0).wait(1).to({rotation:-83.4764,x:1055.8,y:496.8},0).wait(1).to({regX:39.9,regY:40.1,rotation:-83.3866,x:1056,y:496.6},0).wait(1).to({regX:39.8,regY:40,rotation:-83.2969,x:1055.9,y:496.7},0).wait(1).to({regX:39.7,regY:40.1,rotation:-83.2087,x:1056,y:496.75},0).wait(1).to({regX:39.8,rotation:-83.118,x:1056.05,y:496.6},0).wait(1).to({regX:39.9,regY:40,rotation:-83.0282,x:1056,y:496.45},0).wait(1).to({regX:39.8,rotation:-82.9383,x:1056.05,y:496.4},0).wait(1).to({rotation:-82.8484,x:1056.1},0).wait(1).to({rotation:-82.7595,x:1056.15,y:496.3},0).wait(1).to({regX:39.9,rotation:-82.6696,x:1056.1,y:496.2},0).wait(1).to({rotation:-82.5805,x:1056.15,y:496.15},0).wait(1).to({regX:39.8,rotation:-82.4904,x:1056.2,y:496.2},0).wait(1).to({regX:39.9,rotation:-82.4006,x:1056.25,y:495.95},0).wait(1).to({regX:39.6,regY:40.1,rotation:-82.3106},0).wait(1).to({rotation:-82.3458,x:1056.3,y:496.05},0).wait(1).to({regY:40,rotation:-82.3801,x:1056.25,y:496.1},0).wait(1).to({rotation:-82.4154,x:1056.3},0).wait(1).to({regY:40.1,rotation:-82.4497,x:1056.35,y:496.15},0).wait(1).to({regY:40,rotation:-82.485,x:1056.3},0).wait(1).to({rotation:-82.5212},0).wait(1).to({rotation:-82.5545,y:496.2},0).wait(1).to({regY:40.1,rotation:-82.5889,x:1056.35},0).wait(1).to({regY:40,rotation:-82.6241,x:1056.3},0).wait(1).to({scaleX:0.9998,scaleY:0.9998,rotation:-82.6593,y:496.25},0).wait(1).to({regX:39.5,regY:40.1,rotation:-82.6946,x:1056.35,y:496.35},0).wait(1).to({regX:39.6,regY:40,rotation:-82.729,x:1056.3,y:496.3},0).wait(1).to({regY:40.1,rotation:-82.7652,x:1056.35,y:496.15},0).wait(1).to({regY:40,rotation:-82.8205,x:1056.4,y:496.2},0).wait(1).to({rotation:-82.8778,y:496.25},0).wait(1).to({rotation:-82.9342,x:1056.35,y:496.2},0).wait(1).to({rotation:-82.9915,x:1056.4,y:496.25},0).wait(1).to({rotation:-83.0479,x:1056.35},0).wait(1).to({rotation:-83.1051,y:496.3},0).wait(1).to({regY:40.1,rotation:-83.1615,x:1056.4},0).wait(1).to({regY:40,rotation:-83.2187,x:1056.3,y:496.25},0).wait(1).to({regX:39.5,rotation:-83.276,x:1056.35,y:496.4},0).wait(1).to({rotation:-83.3323,y:496.45},0).wait(1).to({regX:39.6,rotation:-83.3895,x:1056.4,y:496.35},0).wait(1).to({rotation:-83.4459,x:1056.35},0).wait(1).to({rotation:-83.504,x:1056.4,y:496.3},0).wait(1).to({regY:40.1,rotation:-83.5602,x:1056.45,y:496.4},0).wait(1).to({regY:40,rotation:-83.6164,x:1056.35},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:-83.674,x:1056.25},0).wait(1).to({scaleX:0.9998,scaleY:0.9998,rotation:-83.3059,x:1056.3,y:496.5},0).wait(1).to({rotation:-82.9385,x:1056.35,y:496.45},0).wait(1).to({regY:40.1,rotation:-82.5701,x:1056.4,y:496.55},0).wait(1).to({rotation:-82.2022},0).wait(1).to({regY:40,rotation:-81.834,x:1056.35},0).wait(1).to({regY:39.9,rotation:-81.4655,x:1056.3,y:496.5},0).wait(1).to({regY:40,rotation:-81.0966,x:1056.35,y:496.6},0).wait(1).to({rotation:-80.729,x:1056.4,y:496.65},0).wait(1).to({rotation:-80.3603,x:1056.45,y:496.6},0).wait(1).to({regY:40.1,rotation:-79.9928,x:1056.5},0).wait(1).to({regY:40,rotation:-79.6242,x:1056.4},0).wait(1).to({regY:40.1,rotation:-79.2558,x:1056.55,y:496.65},0).wait(1).to({regY:40,rotation:-78.8881,x:1056.4,y:496.6},0).wait(1).to({regX:39.5,regY:40.3,rotation:-78.5196,x:1056.35,y:496.45},0).wait(1).to({rotation:-78.5975,x:1056.45,y:496.55},0).wait(1).to({rotation:-78.675,x:1056.4,y:496.6},0).wait(1).to({regX:39.4,rotation:-78.7527,y:496.65},0).wait(1).to({regY:40.2,rotation:-78.8302,x:1056.35,y:496.7},0).wait(1).to({rotation:-78.9077},0).wait(1).to({regY:40.4,rotation:-78.9852,x:1056.55,y:496.85},0).wait(1).to({regY:40.2,rotation:-79.0627,x:1056.3,y:496.8},0).wait(1).to({rotation:-79.1402,x:1056.25},0).wait(1).to({regY:40.3,rotation:-79.2176,x:1056.4,y:496.85},0).wait(1).to({regX:39.5,regY:40.2,rotation:-79.2942,x:1056.35,y:496.8},0).wait(1).to({regY:40.4,rotation:-79.3723,x:1056.55,y:496.85},0).wait(1).to({regY:40.2,rotation:-79.4507,x:1056.35,y:496.8},0).wait(1).to({regX:39.4,rotation:-79.5272,x:1056.3,y:496.9},0).wait(1).to({rotation:-79.6045,x:1056.35},0).wait(1).to({regY:40.3,rotation:-79.6827,x:1056.4,y:496.95},0).wait(1).to({regY:40.4,rotation:-79.7601,x:1056.5,y:497.05},0).wait(1).to({regY:40.2,rotation:-79.8381,x:1056.3},0).wait(1).to({regY:40.3,rotation:-79.9155,x:1056.4,y:497},0).wait(1).to({regY:40.2,rotation:-79.9928,x:1056.35,y:497.05},0).wait(1).to({regX:39.3,regY:40.4,rotation:-80.0712,y:496.95},0).wait(1).to({rotation:-80.149,x:1056.4,y:497.1},0).wait(1).to({regY:40.5,rotation:-80.227,x:1056.5},0).wait(1).to({regX:39.2,regY:40.4,rotation:-80.3042,x:1056.4,y:497.2},0).wait(1).to({rotation:-80.3831,x:1056.35,y:497.3},0).wait(1).to({rotation:-80.4595,x:1056.45},0).wait(1).to({rotation:-80.5377,x:1067.9,y:497.25},0).wait(1).to({rotation:-80.6137,x:1080.75,y:497.3},0).wait(1).to({rotation:-80.6928,x:1093.35},0).wait(1).to({regX:39.3,rotation:-80.7697,x:1106.1,y:497.2},0).wait(1).to({regX:39.2,rotation:-80.8469,x:1118.8,y:497.3},0).wait(1).to({rotation:-80.9247,x:1131.45},0).wait(1).to({rotation:-81.002,x:1143.95},0).wait(1).to({regY:40.5,rotation:-81.0772,x:1162.05,y:497.5},0).wait(1).to({regY:40.4,rotation:-81.1541,x:1179.85,y:497.4},0).wait(1).to({regX:39.1,rotation:-81.233,x:1197.65,y:497.45},0).wait(1).to({rotation:-81.3097,x:1215.65,y:497.5},0).wait(1).to({rotation:-81.3885,x:1233.55},0).wait(1).to({rotation:-81.4663,x:1251.4,y:497.55},0).wait(1).to({rotation:-81.544},0).wait(1).to({regY:40.5,rotation:-81.6217,x:1251.45},0).wait(1).to({regY:40.4,rotation:-81.6987,x:1251.3,y:497.4},0).wait(1).to({regY:40.5,rotation:-81.7755,x:1269.7,y:497.5},0).wait(1).to({regY:40.4,rotation:-81.8532,x:1287.9},0).wait(1).to({regY:40.5,rotation:-81.9311,x:1306.2,y:497.55},0).wait(1).to({regX:39,regY:40.4,rotation:-82.0078,x:1324.3,y:497.6},0).wait(1).to({rotation:-82.0856,x:1342.45,y:497.65},0).wait(1).to({regX:39.1,rotation:-82.1635,x:1360.7,y:497.45},0).wait(1).to({regY:40.5,scaleX:1.0007,rotation:0,skewX:-79.0269,skewY:-79.6779,x:1379.75,y:499.5},0).wait(1).to({regY:40.3,scaleX:1.0016,skewX:-75.891,skewY:-77.1909,x:1398.65,y:501.45},0).wait(1).to({regX:39,regY:40.4,scaleX:1.0025,skewX:-72.7545,skewY:-74.7043,x:1417.6,y:503.6},0).wait(1).to({regX:39.1,scaleX:1.0034,skewX:-69.6182,skewY:-72.217,x:1436.55,y:505.5},0).wait(1).to({regY:40.3,scaleX:1.0043,skewX:-66.482,skewY:-69.7309,x:1455.5,y:507.5},0).wait(1).to({regX:39,regY:40.5,scaleX:1.0053,skewX:-63.345,skewY:-67.2447,x:1474.55,y:509.65},0).wait(1).to({regX:39.1,regY:40.4,scaleX:1.0062,skewX:-60.2089,skewY:-64.7578,x:1473.3,y:511.55},0).wait(1).to({regX:39,scaleX:1.0071,skewX:-57.0722,skewY:-62.2717,x:1471.95,y:513.65},0).wait(1).to({scaleX:1.008,skewX:-53.9364,skewY:-59.7848,x:1470.7,y:515.7},0).wait(1).to({scaleX:1.0089,skewX:-50.7999,skewY:-57.2992,x:1469.45,y:517.7},0).wait(1).to({regY:40.3,scaleX:1.0098,skewX:-47.6634,skewY:-54.8124,x:1468.1,y:519.6},0).wait(1).to({regY:40.4,scaleX:1.0107,skewX:-44.5264,skewY:-52.3255,x:1466.9,y:521.7},0).wait(1).to({scaleX:1.0116,skewX:-41.3903,skewY:-49.8396,x:1465.65,y:523.65},0).wait(1).to({regX:39.6,regY:40.6,scaleX:1.0126,scaleY:0.9999,skewX:-38.2544,skewY:-47.3536,x:1464.35,y:525.55},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({regX:39.3,regY:40.5,skewX:-23.255,skewY:-32.3537,x:1459.2,y:524.05},0).wait(1).to({regX:39.2,scaleX:1.0125,scaleY:0.9998,skewX:-24.6352,skewY:-33.7349,x:1459.55,y:524.4},0).wait(1).to({skewX:-26.0195,skewY:-35.1175,x:1460,y:524.7},0).wait(1).to({regX:39.5,regY:40.6,skewX:-27.4012,skewY:-36.5007,x:1460.6,y:524.85},0).wait(1).to({skewX:-26.0195,skewY:-35.1185,x:1460.1,y:524.65},0).wait(1).to({regX:39.4,skewX:-24.6371,skewY:-33.7363,x:1458.8,y:524.4},0).wait(1).to({regX:39.2,regY:40.4,scaleX:1.0126,scaleY:0.9999,skewX:23.255,skewY:-147.6463,x:1592,y:524},0).wait(1).to({regY:40.5,scaleX:1.0125,scaleY:0.9998,skewX:24.636,skewY:-146.2651,x:1592.35,y:524.4},0).wait(1).to({skewX:26.0195,skewY:-144.8825,x:1592.75,y:524.7},0).wait(1).to({regX:39.5,regY:40.6,skewX:27.4012,skewY:-143.4993,x:1593.2,y:524.85},0).wait(1).to({skewX:26.0195,skewY:-144.8815,x:1592.8,y:524.65},0).wait(1).to({regX:39.4,skewX:24.6371,skewY:-146.2642,x:1592.3,y:524.4},0).wait(1).to({regX:39.2,regY:40.4,scaleX:1.0126,scaleY:0.9999,skewX:23.255,skewY:-147.6463,x:1464.85,y:524},0).wait(1).to({regX:39.1,scaleX:1.0125,scaleY:0.9998,skewX:24.636,skewY:-146.2651,x:1465.35,y:524.35},0).wait(1).to({skewX:26.0195,skewY:-144.8825,x:1465.8,y:524.7},0).wait(1).to({regX:39.5,regY:40.6,skewX:27.4012,skewY:-143.4993,x:1466.25,y:524.85},0).wait(1).to({skewX:26.0195,skewY:-144.8815,x:1465.85,y:524.6},0).wait(1).to({regX:39.4,skewX:24.6371,skewY:-146.2642,x:1465.35,y:524.35},0).wait(1).to({regX:39.2,regY:40.3,scaleX:1.0126,scaleY:0.9999,skewX:23.255,skewY:-147.6463,x:1207.95,y:523.9},0).wait(1).to({regX:39.1,regY:40.4,scaleX:1.0125,scaleY:0.9998,skewX:24.636,skewY:-146.2651,x:1208.4,y:524.45},0).wait(1).to({regX:39.2,skewX:26.0195,skewY:-144.8825,x:1208.8,y:524.7},0).wait(1).to({regX:39.5,regY:40.6,skewX:27.4012,skewY:-143.4993,x:1209.3,y:524.85},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({x:893.85},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({x:955},0).wait(1).to({x:893.85},0).wait(3).to({x:868.65},0).wait(4).to({x:668.7},0).wait(4).to({skewX:12.4017,skewY:-158.4992,x:634.75},0).wait(5).to({skewX:27.4008,skewY:-143.5002,x:536.65},0).wait(4).to({skewX:12.4012,skewY:-158.4986,x:365.15},0).wait(4).to({regX:39.4,regY:40.7,skewX:-2.5972,skewY:-173.4988,x:-69.05,y:525.35},0).to({_off:true},4).wait(749));

	// פקק
	this.instance_14 = new lib.פקקבקבוק("synched",0);
	this.instance_14.setTransform(1250.85,383.55,0.9999,0.9999,0,0,0,9.9,6.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(127).to({x:1250.15},0).wait(61).to({regX:9.8,regY:6.5,x:1235.35,y:382},0).wait(5).to({regY:6.4,scaleX:1,scaleY:1,rotation:-14.999,x:1207.05,y:385.8},0).wait(4).to({startPosition:0},0).wait(66).to({regX:0,regY:0,scaleX:0.9999,scaleY:0.9999,rotation:-14.9975,x:1197.05,y:382.45},0).wait(1).to({regX:10,regY:6.1,scaleX:1,scaleY:1,rotation:-14.9989,x:1205.4,y:385.75},0).wait(1).to({x:1202.5},0).wait(1).to({x:1207.6,y:366.35},0).wait(1).to({x:1213.15,y:364},0).wait(1).to({x:1223.45,y:363.05},0).wait(1).to({x:1228.85,y:364.15},0).wait(1).to({x:1235.35,y:364.85},0).wait(1).to({x:1243.05,y:365.3},0).wait(1).to({x:1249.45,y:372.8},0).wait(1).to({x:1255.85,y:380.35},0).wait(1).to({x:1287.8,y:382.75},0).wait(1).to({x:1312.15,y:394.35},0).wait(1).to({x:1328.85,y:415.2},0).wait(1).to({x:1359.65,y:429.95},0).wait(1).to({x:1390.45,y:444.7},0).wait(1).to({x:1421.25,y:459.45},0).wait(1).to({x:1453.15,y:479.35},0).wait(1).to({x:1485.1,y:499.3},0).wait(1).to({x:1509.4,y:508.65},0).wait(1).to({x:1533.75,y:518},0).wait(1).to({x:1558.1,y:527.35},0).wait(1).to({x:1577.15,y:538.85},0).wait(1).to({x:1596.2,y:550.35},0).wait(1).to({x:1615.3,y:561.9},0).wait(1).to({x:1633.3,y:572.25},0).wait(1).to({x:1651.3,y:582.6},0).wait(1).to({x:1669.3,y:592.95},0).wait(1).to({x:1685.9,y:600.7},0).wait(1).to({x:1702.55,y:608.5},0).wait(1).to({x:1719.15,y:616.25},0).wait(1).to({x:1735.8,y:624.05},0).wait(1).to({x:1738.45,y:629.7},0).wait(1).to({x:1741.1,y:635.35},0).wait(1).to({x:1743.75,y:641.05},0).wait(1).to({x:1743,y:643.85},0).wait(1).to({x:1742.3,y:646.7},0).wait(1).to({x:1741.6,y:649.5},0).wait(1).to({x:1740.85,y:652.35},0).wait(1).to({x:1740.15,y:655.15},0).wait(1).to({x:1739.45,y:658},0).to({_off:true},1).wait(960));

	// פה
	this.instance_15 = new lib.פיות("single",3);
	this.instance_15.setTransform(1248.7,489.1,1,1,0,0,0,27.8,17);

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(120).to({x:1257.3,y:486.1,startPosition:0},0).wait(68).to({regY:17.1,x:1239.05,y:486.9,startPosition:2},0).wait(5).to({regX:27.9,regY:17.2,scaleX:1.0033,scaleY:1.0033,rotation:-15.7467,x:1239.3,y:487},0).wait(73).to({scaleX:1.0671,scaleY:1.0671,rotation:-14.9992,x:1236.85,y:484.85,startPosition:0},0).to({regY:17.3,scaleX:1.067,scaleY:1.067,rotation:-24.2039,x:1242.55,y:487.2,startPosition:1},8).to({regY:17.2,rotation:-39.2024,x:1238.5,y:483.95},8).to({regY:17.3,rotation:-39.2034,x:1223,y:471.35},7).to({regY:17.4,rotation:-56.1363,x:1220.4,y:474.25},8).to({rotation:-71.1359,x:1183.4,y:477.2},7).to({startPosition:1},37).to({regY:17.5,scaleX:1.0669,scaleY:1.0669,rotation:-66.8509,x:1194.1,y:476.45},2).to({regY:17.4,scaleX:1.067,scaleY:1.067,rotation:-56.1363,x:1220.4,y:474.25},8).to({regY:17.3,rotation:-39.2034,x:1223,y:471.35},12).to({regY:17.2,rotation:-24.2024,x:1238.45,y:483.95,startPosition:4},11).wait(34).to({x:1253.65},0).wait(1).to({x:1262.2},0).wait(1).to({x:1275.3,y:477.45},0).wait(1).to({x:1291.65},0).wait(1).to({x:1301.15},0).wait(1).to({x:1318.25},0).wait(1).to({x:1327.85,y:470.45},0).wait(1).to({x:1353.5},0).wait(1).to({x:1364.6,y:465.95},0).wait(1).to({x:1387.8,y:470.45},0).wait(1).to({x:1405.85},0).wait(1).to({x:1417.25},0).wait(1).to({x:1418.2},0).wait(1).to({startPosition:4},0).wait(1).to({rotation:-24.2031,x:1425.7,y:471.75},0).wait(1).to({x:1440.6,y:467.1},0).wait(1).to({x:1457.7},0).wait(1).to({x:1474.05,y:468.6},0).wait(1).to({x:1494},0).wait(1).to({rotation:-24.2024,x:1512.3,y:466.7},0).wait(1).to({x:1528.45},0).wait(1).to({x:1551.1,y:477.85},0).wait(1).to({x:1566.3,y:491.15},0).wait(1).to({x:1582.95,y:500.95},0).wait(1).to({x:1601.95,y:516.15},0).wait(1).to({x:1620.3,y:525.05},0).wait(1).to({x:1630.75,y:535.5},0).wait(3).to({x:1622.15,y:534.75},0).to({rotation:-9.2032,x:1734.35,y:573.9},22).to({_off:true},776).wait(29));

	// גבות
	this.instance_16 = new lib.גבות1("single",1);
	this.instance_16.setTransform(1250.25,429.55,1,1,0,0,0,24.4,7.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_16).to({startPosition:1},120).wait(68).to({regY:7.6,x:1236.2,y:428.6},0).wait(5).to({regX:24.6,regY:7.5,rotation:-14.999,x:1219.85,y:431.5},0).to({startPosition:1},4).to({x:1216.95},69).to({x:1219.85,y:429.25},8).to({regY:7.6,scaleX:0.9999,scaleY:0.9999,rotation:-29.9987,x:1209.35,y:433.05},8).to({regX:24.5,rotation:-44.9975,x:1178.5,y:428.6},7).to({x:1166.5,y:439.85},8).to({rotation:-59.997,x:1121.6,y:458.6},7).to({startPosition:1},37).to({regY:7.7,scaleX:0.9998,scaleY:0.9998,rotation:-55.7133,x:1134.5,y:453.2},2).to({regY:7.6,scaleX:0.9999,scaleY:0.9999,rotation:-44.9975,x:1166.5,y:439.85},8).to({x:1178.5,y:428.6},12).to({regX:24.6,rotation:-29.9987,x:1209.35,y:433.05},11).wait(34).to({x:1224.55},0).wait(1).to({x:1233.1},0).wait(1).to({x:1246.2,y:426.55},0).wait(1).to({x:1262.55},0).wait(1).to({x:1272.05},0).wait(1).to({x:1289.15},0).wait(1).to({x:1298.75,y:419.55},0).wait(1).to({x:1324.4},0).wait(1).to({x:1335.5,y:415.05},0).wait(1).to({x:1358.7,y:419.55},0).wait(1).to({x:1376.75},0).wait(1).to({x:1388.15},0).wait(1).to({x:1389.1},0).wait(1).to({startPosition:1},0).wait(1).to({regY:7.7,rotation:-29.9984,x:1396.6,y:420.9},0).wait(1).to({x:1411.5,y:416.25},0).wait(1).to({x:1428.6},0).wait(1).to({x:1444.95,y:417.75},0).wait(1).to({x:1464.9},0).wait(1).to({regY:7.6,rotation:-29.9987,x:1483.2,y:415.8},0).wait(1).to({x:1499.35},0).wait(1).to({x:1522,y:426.95},0).wait(1).to({x:1537.2,y:440.25},0).wait(1).to({x:1553.85,y:450.05},0).wait(1).to({x:1572.85,y:465.25},0).wait(1).to({x:1591.2,y:474.15},0).wait(1).to({x:1601.65,y:484.6},0).wait(3).to({x:1593.05,y:483.85},0).to({rotation:-14.9991,x:1719.35,y:517.25},22).to({_off:true},776).wait(29));

	// בקבוק
	this.instance_17 = new lib.בקבוק("synched",0);
	this.instance_17.setTransform(1210.6,377.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_17).to({startPosition:0},120).wait(68).to({x:1196.5,y:376.35,startPosition:127},0).wait(5).to({rotation:-14.9983,x:1168.1,y:390.45,startPosition:131},0).wait(73).to({x:1165.2},0).to({x:1168.1,startPosition:226},8).to({rotation:-24.2028,x:1152.8,y:402.6,startPosition:230},8).to({scaleX:0.9999,scaleY:0.9999,rotation:-39.2011,x:1117.4,y:414.6,startPosition:235},7).to({regY:0.1,rotation:-54.2017,x:1104.35,y:443.55,startPosition:238},8).to({regX:-0.1,regY:0.2,rotation:-71.134,x:1062.65,y:481.2,startPosition:242},7).to({startPosition:242},37).to({rotation:-66.2953,x:1074.55,y:470.5,startPosition:244},2).to({regX:0,regY:0.1,rotation:-54.2017,x:1104.35,y:443.55,startPosition:238},8).to({regY:0,rotation:-39.2011,x:1117.4,y:414.6,startPosition:235},12).to({scaleX:1,scaleY:1,rotation:-24.2028,x:1152.8,y:402.6,startPosition:230},11).wait(34).to({x:1168,startPosition:264},0).wait(1).to({x:1176.55,startPosition:265},0).wait(1).to({x:1189.65,y:396.1,startPosition:258},0).wait(1).to({x:1206,startPosition:259},0).wait(1).to({x:1215.5,startPosition:260},0).wait(1).to({x:1232.6},0).wait(1).to({x:1242.2,y:389.1,startPosition:261},0).wait(1).to({x:1267.85,startPosition:262},0).wait(1).to({x:1278.95,y:384.6},0).wait(1).to({x:1302.15,y:389.1,startPosition:263},0).wait(1).to({x:1320.2,startPosition:264},0).wait(1).to({x:1331.6,startPosition:265},0).wait(1).to({x:1332.55,startPosition:266},0).wait(1).to({startPosition:267},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:-24.2027,x:1340,y:390.4,startPosition:266},0).wait(1).to({x:1354.9,y:385.75,startPosition:267},0).wait(1).to({x:1372,startPosition:268},0).wait(1).to({x:1388.35,y:387.25},0).wait(1).to({x:1408.3,startPosition:269},0).wait(1).to({scaleX:1,scaleY:1,rotation:-24.2028,x:1426.65,y:385.35},0).wait(1).to({x:1442.8,startPosition:270},0).wait(1).to({x:1465.45,y:396.5},0).wait(1).to({x:1480.65,y:409.8,startPosition:271},0).wait(1).to({x:1497.3,y:419.6},0).wait(1).to({x:1516.3,y:434.8,startPosition:272},0).wait(1).to({x:1534.65,y:443.7},0).wait(1).to({x:1545.1,y:454.15,startPosition:273},0).wait(3).to({x:1536.5,y:453.4,startPosition:284},0).to({rotation:-9.2022,x:1672.65,y:473.2,startPosition:298},22).to({_off:true},776).wait(29));

	// ראש
	this.instance_18 = new lib.ראש("single",0);
	this.instance_18.setTransform(-229.7,446.2,1,1,0,0,0,51.1,72.6);

	
	var _tweenStr_0 = cjs.Tween.get(this.instance_18).wait(1).to({x:-229,y:445.95},0).wait(1).to({x:-228.35,y:445.65},0).wait(1).to({x:-227.65,y:445.4},0).wait(1).to({x:-227,y:445.1},0).wait(1).to({x:-226.3,y:444.85},0).wait(1).to({x:-225.6,y:444.6},0).wait(1).to({x:-224.95,y:444.3},0).wait(1).to({x:-224.25,y:444.05},0).wait(1).to({x:-223.55,y:443.75},0).wait(1).to({x:-222.9,y:443.5},0).wait(1).to({x:-222.2,y:443.25},0).wait(1).to({x:-221.55,y:442.95},0).wait(1).to({x:-220.85,y:442.7},0).wait(1).to({x:-220.15,y:442.45},0).wait(1).to({x:-219.5,y:442.15},0).wait(1).to({x:-218.8,y:441.9},0).wait(1).to({x:-218.15,y:441.6},0).wait(1).to({x:-217.45,y:441.35},0).wait(1).to({x:-216.75,y:441.1},0).wait(1).to({x:-216.1,y:440.8},0).wait(1).to({x:-215.4,y:440.55},0).wait(1).to({x:-214.7,y:440.25},0).wait(1).to({x:-214.05,y:440},0).wait(1).to({x:-213.35,y:439.75},0).wait(1).to({x:-212.7,y:439.45},0).wait(1).to({x:-212,y:439.2},0).wait(1).to({x:-211.3,y:438.9},0).wait(1).to({x:-210.65,y:438.65},0).wait(1).to({x:-209.95,y:438.4},0).wait(1).to({x:-209.3,y:438.1},0).wait(1).to({x:-208.6,y:437.85},0).wait(1).to({x:-207.9,y:437.55},0).wait(1).to({x:-207.25,y:437.3},0).wait(1).to({x:-206.55,y:437.05},0).wait(1).to({x:-205.85,y:436.75},0).wait(1).to({x:-205.2,y:436.5},0).wait(1).to({x:-204.5,y:436.25},0).wait(1).to({x:-203.85,y:435.95},0).wait(1).to({x:-203.15,y:435.7},0).wait(1).to({x:-202.45,y:435.4},0).wait(1).to({x:-201.8,y:435.15},0).wait(1).to({x:-201.1,y:434.9},0).wait(1).to({x:-200.4,y:434.6},0).wait(1).to({x:-199.75,y:434.35},0).wait(1).to({x:-199.05,y:434.05},0).wait(1).to({x:-198.4,y:433.8},0).wait(1).to({x:-197.7,y:433.55},0).wait(1).to({x:-197,y:433.25},0).wait(1).to({x:-196.35,y:433},0).wait(1).to({x:-195.65,y:432.7},0).wait(1).to({x:-195,y:432.45},0).wait(1).to({x:-194.3,y:432.2},0).wait(1).to({x:-193.6,y:431.9},0).wait(1).to({x:-192.95,y:431.65},0).wait(1).to({x:-192.25,y:431.35},0).wait(1).to({x:-191.55,y:431.1},0).wait(1).to({x:-190.9,y:430.85},0).wait(1).to({x:-190.2,y:430.55},0).wait(1).to({x:-189.55,y:430.3},0).wait(1).to({x:-188.85,y:430.05},0).wait(1).to({x:-188.15,y:429.75},0).wait(1).to({x:-187.5,y:429.5},0).wait(1).to({x:-186.8,y:429.2},0).wait(1).to({x:-186.15,y:428.95},0).wait(1).to({x:-185.45,y:428.7},0).wait(1).to({x:-184.75,y:428.4},0).wait(1).to({x:-184.1,y:428.15},0).wait(1).to({x:-183.4,y:427.85},0).wait(1).to({x:-182.7,y:427.6},0).wait(1).to({x:-182.05,y:427.35},0).wait(1).to({x:-181.35,y:427.05},0).wait(1).to({x:-180.7,y:426.8},0).wait(1).to({x:-180,y:426.5},0).wait(1).to({x:-179.3,y:426.25},0).wait(1).to({x:-178.65,y:426},0).wait(1).to({x:-177.95,y:425.7},0).wait(1).to({x:-177.3,y:425.45},0).wait(1).to({x:-176.6,y:425.15},0).wait(1).to({x:-175.9,y:424.9},0).wait(1).to({x:-175.25,y:424.65},0).wait(1).to({x:-174.55,y:424.35},0).wait(1).to({x:-173.85,y:424.1},0).wait(1).to({x:-173.2,y:423.8},0).wait(1).to({x:-172.5,y:423.55},0).wait(1).to({x:-171.85,y:423.3},0).wait(1).to({x:-171.15,y:423},0).wait(1).to({x:-170.45,y:422.75},0).wait(1).to({x:-169.8,y:422.5},0).wait(1).to({x:-169.1,y:422.2},0).wait(1).to({x:-168.45,y:421.95},0).wait(1).to({x:-167.75,y:421.65},0).wait(1).to({x:-167.05,y:421.4},0).wait(1).to({x:-166.4,y:421.15},0).wait(1).to({x:-165.7,y:420.85},0).wait(1).to({x:-165,y:420.6},0).wait(1).to({x:-164.35,y:420.3},0).wait(1).to({x:-163.65,y:420.05},0).wait(1).to({x:-163,y:419.8},0).wait(1).to({x:-162.3,y:419.5},0).wait(1).to({x:-161.6,y:419.25},0).wait(1).to({x:-160.95,y:418.95},0).wait(1).to({x:-160.25,y:418.7},0).wait(1).to({x:-159.55,y:418.45},0).wait(1).to({x:-158.9,y:418.15},0).wait(1).to({x:-158.2,y:417.9},0).wait(1).to({x:-157.55,y:417.6},0).wait(1).to({x:-156.85,y:417.35},0).wait(1).to({x:-156.15,y:417.1},0).wait(1).to({x:-155.5,y:416.8},0).wait(1).to({x:-154.8,y:416.55},0).wait(1).to({x:-154.15,y:416.3},0).wait(1).to({x:-153.45,y:416},0).wait(1).to({x:-152.75,y:415.75},0).wait(1).to({x:-152.1,y:415.45},0).wait(1).to({x:-151.4,y:415.2},0).wait(1).to({x:-150.7,y:414.95},0).wait(1).to({x:-150.05,y:414.65},0).wait(1).to({x:-149.35,y:414.4},0).wait(1).to({x:-148.7,y:414.1},0).wait(1).to({x:-148,y:413.85},0).wait(1).to({x:-123.65},0).wait(1).to({x:-99.25},0).wait(1).to({x:-74.9},0).wait(1).to({x:-59.85},0).wait(1).to({x:-44.85},0).wait(1).to({x:-29.8},0).wait(1).to({x:33.75},0).wait(1).to({x:97.35},0).wait(1).to({x:160.9},0).wait(1).to({x:199.3},0).wait(1).to({x:237.65},0).wait(1).to({x:276.05},0).wait(1).to({x:307.25},0).wait(1).to({x:338.45},0).wait(1).to({x:369.65},0).wait(1).to({x:404.9},0).wait(1).to({x:440.1},0).wait(1).to({x:475.35},0).wait(1).to({x:499.75},0).wait(1).to({x:524.1},0).wait(1).to({x:548.5},0).wait(1).to({x:601.6},0).wait(1).to({x:654.65},0).wait(1).to({x:707.75},0).wait(1).to({x:746.85},0).wait(1).to({x:785.95},0).wait(1).to({x:825.05},0).wait(1).to({x:853.95},0).wait(1).to({x:882.8},0).wait(1).to({x:911.7},0).wait(1).to({x:933.2},0).wait(1).to({x:954.65},0).wait(1).to({x:976.15},0).wait(1).to({x:1006.35},0).wait(1).to({x:1036.55},0).wait(1).to({x:1066.75},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:3},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1);
	this.timeline.addTween(_tweenStr_0.to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({x:1078.3},0).wait(1).to({x:1091},0).wait(1).to({x:1103.65},0).wait(1).to({x:1116.35},0).wait(1).to({x:1129},0).wait(1).to({x:1141.65},0).wait(1).to({x:1154.35},0).wait(1).to({x:1172.25},0).wait(1).to({x:1190.15},0).wait(1).to({x:1208.05},0).wait(1).to({x:1225.95},0).wait(1).to({x:1243.85},0).wait(1).to({x:1261.75},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({x:1280},0).wait(1).to({x:1298.25},0).wait(1).to({x:1316.5},0).wait(1).to({x:1334.7},0).wait(1).to({x:1352.95},0).wait(1).to({x:1371.2},0).wait(1).to({x:1391.4},0).wait(1).to({x:1411.65},0).wait(1).to({x:1431.85},0).wait(1).to({x:1452.05},0).wait(1).to({x:1472.3},0).wait(1).to({x:1492.5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:5},0).wait(1).to({skewY:180,x:1558.5,startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({x:1431.55},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({x:1174.6},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({x:859.15},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({x:920.3},0).wait(1).to({x:859.15},0).wait(3).to({x:833.95},0).wait(4).to({x:634},0).wait(4).to({x:591.4},0).wait(5).to({x:499.8},0).wait(4).to({x:324.25},0).wait(4).to({x:-121.55},0).to({_off:true},4).wait(749));

	// בטן
	this.instance_19 = new lib.בטן("synched",0);
	this.instance_19.setTransform(-219,655.75,1,1,0,0,0,60.5,149.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_19).to({x:-137.3,y:623.4},120).to({x:-64.2},3).to({x:-19.1},3).to({x:171.6},3).to({x:286.75},3).to({x:380.35},3).to({x:486.05},3).to({x:559.2},3).to({x:718.45},3).to({x:835.75},3).to({x:922.4},3).to({x:986.85},3).to({x:1077.45},3).wait(251).to({x:1089},0).to({x:1165.05},6).to({x:1272.45},6).to({startPosition:0},3).to({x:1381.9},6).to({x:1503.2},6).to({startPosition:0},3).wait(23).to({skewY:180,x:1547.8},0).wait(6).to({x:1420.85},0).wait(6).to({x:1163.9},0).wait(6).to({x:848.45},0).wait(8).to({x:909.6},0).wait(1).to({x:848.45},0).wait(3).to({x:823.25},0).wait(4).to({x:623.3},0).wait(4).to({x:580.7},0).wait(5).to({x:489.1},0).wait(4).to({x:313.55},0).wait(4).to({x:-132.25},0).to({_off:true},4).wait(749));

	// רגליים
	this.instance_20 = new lib.רגליים("single",0);
	this.instance_20.setTransform(-139.15,931.5,1,1,0,0,0,133.1,206.3);

	
	var _tweenStr_1 = cjs.Tween.get(this.instance_20).wait(1).to({x:-138.45,y:931.2},0).wait(1).to({x:-137.8,y:930.85},0).wait(1).to({x:-137.1,y:930.5},0).wait(1).to({x:-136.45,y:930.15},0).wait(1).to({x:-135.75,y:929.85},0).wait(1).to({x:-135.05,y:929.55},0).wait(1).to({x:-134.4,y:929.2},0).wait(1).to({x:-133.7,y:928.85},0).wait(1).to({x:-133,y:928.5},0).wait(1).to({x:-132.35,y:928.2},0).wait(1).to({x:-131.65,y:927.9},0).wait(1).to({x:-131,y:927.55},0).wait(1).to({x:-130.3,y:927.25},0).wait(1).to({x:-129.6,y:926.9},0).wait(1).to({x:-128.95,y:926.55},0).wait(1).to({x:-128.25,y:926.25},0).wait(1).to({x:-127.6,y:925.9},0).wait(1).to({x:-126.9,y:925.6},0).wait(1).to({x:-126.2,y:925.25},0).wait(1).to({x:-125.55,y:924.9},0).wait(1).to({x:-124.85,y:924.6},0).wait(1).to({x:-124.15,y:924.25},0).wait(1).to({x:-123.5,y:923.95},0).wait(1).to({x:-122.8,y:923.6},0).wait(1).to({x:-122.15,y:923.25},0).wait(1).to({x:-121.45,y:922.95},0).wait(1).to({x:-120.75,y:922.6},0).wait(1).to({x:-120.1,y:922.3},0).wait(1).to({x:-119.4,y:921.95},0).wait(1).to({x:-118.75,y:921.6},0).wait(1).to({x:-118.05,y:921.3},0).wait(1).to({x:-117.35,y:920.95},0).wait(1).to({x:-116.7,y:920.65},0).wait(1).to({x:-116,y:920.3},0).wait(1).to({x:-115.3,y:919.95},0).wait(1).to({x:-114.65,y:919.65},0).wait(1).to({x:-113.95,y:919.35},0).wait(1).to({x:-113.3,y:919},0).wait(1).to({x:-112.6,y:918.7},0).wait(1).to({x:-111.9,y:918.3},0).wait(1).to({x:-111.25,y:918},0).wait(1).to({x:-110.55,y:917.7},0).wait(1).to({x:-109.85,y:917.35},0).wait(1).to({x:-109.2,y:917.05},0).wait(1).to({x:-108.5,y:916.65},0).wait(1).to({x:-107.85,y:916.35},0).wait(1).to({x:-107.15,y:916.05},0).wait(1).to({x:-106.45,y:915.7},0).wait(1).to({x:-105.8,y:915.4},0).wait(1).to({x:-105.1,y:915},0).wait(1).to({x:-104.45,y:914.7},0).wait(1).to({x:-103.75,y:914.4},0).wait(1).to({x:-103.05,y:914.05},0).wait(1).to({x:-102.4,y:913.75},0).wait(1).to({x:-101.7,y:913.35},0).wait(1).to({x:-101,y:913.05},0).wait(1).to({x:-100.35,y:912.75},0).wait(1).to({x:-99.65,y:912.4},0).wait(1).to({x:-99,y:912.1},0).wait(1).to({x:-98.3,y:911.8},0).wait(1).to({x:-97.6,y:911.4},0).wait(1).to({x:-96.95,y:911.1},0).wait(1).to({x:-96.25,y:910.75},0).wait(1).to({x:-95.6,y:910.45},0).wait(1).to({x:-94.9,y:910.15},0).wait(1).to({x:-94.2,y:909.75},0).wait(1).to({x:-93.55,y:909.45},0).wait(1).to({x:-92.85,y:909.1},0).wait(1).to({x:-92.15,y:908.8},0).wait(1).to({x:-91.5,y:908.5},0).wait(1).to({x:-90.8,y:908.1},0).wait(1).to({x:-90.15,y:907.8},0).wait(1).to({x:-89.45,y:907.45},0).wait(1).to({x:-88.75,y:907.15},0).wait(1).to({x:-88.1,y:906.85},0).wait(1).to({x:-87.4,y:906.45},0).wait(1).to({x:-86.75,y:906.15},0).wait(1).to({x:-86.05,y:905.8},0).wait(1).to({x:-85.35,y:905.5},0).wait(1).to({x:-84.7,y:905.2},0).wait(1).to({x:-84,y:904.8},0).wait(1).to({x:-83.3,y:904.5},0).wait(1).to({x:-82.65,y:904.15},0).wait(1).to({x:-81.95,y:903.85},0).wait(1).to({x:-81.3,y:903.55},0).wait(1).to({x:-80.6,y:903.2},0).wait(1).to({x:-79.9,y:902.85},0).wait(1).to({x:-79.25,y:902.55},0).wait(1).to({x:-78.55,y:902.2},0).wait(1).to({x:-77.9,y:901.9},0).wait(1).to({x:-77.2,y:901.55},0).wait(1).to({x:-76.5,y:901.2},0).wait(1).to({x:-75.85,y:900.9},0).wait(1).to({x:-75.15,y:900.55},0).wait(1).to({x:-74.45,y:900.25},0).wait(1).to({x:-73.8,y:899.9},0).wait(1).to({x:-73.1,y:899.55},0).wait(1).to({x:-72.45,y:899.25},0).wait(1).to({x:-71.75,y:898.9},0).wait(1).to({x:-71.05,y:898.6},0).wait(1).to({x:-70.4,y:898.25},0).wait(1).to({x:-69.7,y:897.9},0).wait(1).to({x:-69,y:897.6},0).wait(1).to({x:-68.35,y:897.25},0).wait(1).to({x:-67.65,y:896.95},0).wait(1).to({x:-67,y:896.6},0).wait(1).to({x:-66.3,y:896.25},0).wait(1).to({x:-65.6,y:895.95},0).wait(1).to({x:-64.95,y:895.6},0).wait(1).to({x:-64.25,y:895.3},0).wait(1).to({x:-63.6,y:895},0).wait(1).to({x:-62.9,y:894.65},0).wait(1).to({x:-62.2,y:894.3},0).wait(1).to({x:-61.55,y:893.95},0).wait(1).to({x:-60.85,y:893.65},0).wait(1).to({x:-60.15,y:893.35},0).wait(1).to({x:-59.5,y:893},0).wait(1).to({x:-58.8,y:892.65},0).wait(1).to({x:-58.15,y:892.3},0).wait(1).to({x:-57.45,y:892},0).wait(1).to({x:-33.05,y:893.25},0).wait(1).to({x:-8.65,y:894.55},0).wait(1).to({x:15.75,y:895.8,startPosition:1},0).wait(1).to({x:28.35,y:892.05},0).wait(1).to({x:40.9,y:888.25},0).wait(1).to({x:53.5,y:884.5,startPosition:2},0).wait(1).to({x:119.45,y:887},0).wait(1).to({x:185.5,y:889.5},0).wait(1).to({x:251.45,y:892,startPosition:0},0).wait(1).to({x:289.9,y:893.25},0).wait(1).to({x:328.25,y:894.55},0).wait(1).to({x:366.7,y:895.8,startPosition:1},0).wait(1).to({x:395.45,y:892.05},0).wait(1).to({x:424.2,y:888.25},0).wait(1).to({x:452.95,y:884.5,startPosition:2},0).wait(1).to({x:490.6,y:887},0).wait(1).to({x:528.25,y:889.5},0).wait(1).to({x:565.9,y:892,startPosition:0},0).wait(1).to({x:590.35,y:893.25},0).wait(1).to({x:614.7,y:894.55},0).wait(1).to({x:639.15,y:895.8,startPosition:1},0).wait(1).to({x:689.8,y:892.05},0).wait(1).to({x:740.4,y:888.25},0).wait(1).to({x:791.05,y:884.5,startPosition:2},0).wait(1).to({x:832.55,y:887},0).wait(1).to({x:874.1,y:889.5},0).wait(1).to({x:915.6,y:892,startPosition:0},0).wait(1).to({x:944.55,y:893.25},0).wait(1).to({x:973.4,y:894.55},0).wait(1).to({x:1002.35,y:895.8,startPosition:1},0).wait(1).to({x:1021.4,y:892.05},0).wait(1).to({x:1040.4,y:888.25},0).wait(1).to({x:1059.45,y:884.5,startPosition:2},0).wait(1).to({x:1092.05,y:887},0).wait(1).to({x:1124.7,y:889.5},0).wait(1).to({x:1157.3,y:892,startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1);
	this.timeline.addTween(_tweenStr_1.to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({x:1168.85},0).wait(1).to({x:1181.55},0).wait(1).to({x:1194.2},0).wait(1).to({x:1206.9,startPosition:1},0).wait(1).to({x:1219.55},0).wait(1).to({x:1232.2},0).wait(1).to({x:1244.9,startPosition:2},0).wait(1).to({x:1262.8},0).wait(1).to({x:1280.7},0).wait(1).to({x:1298.6,startPosition:0},0).wait(1).to({x:1316.5},0).wait(1).to({x:1334.4},0).wait(1).to({x:1352.3,startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:2},0).wait(1).to({x:1370.55},0).wait(1).to({x:1388.8},0).wait(1).to({x:1407.05,startPosition:0},0).wait(1).to({x:1425.25},0).wait(1).to({x:1443.5},0).wait(1).to({x:1461.75,startPosition:1},0).wait(1).to({x:1481.95},0).wait(1).to({x:1502.2},0).wait(1).to({x:1522.4,startPosition:2},0).wait(1).to({x:1542.6},0).wait(1).to({x:1562.85},0).wait(1).to({x:1583.05,startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({skewY:180,x:1467.95},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:2},0).wait(1).to({startPosition:2},0).wait(1).to({startPosition:2},0).wait(1).to({x:1336.7,y:896.3,startPosition:1},0).wait(1).to({x:1334.55,y:892},0).wait(1).to({startPosition:1},0).wait(1).to({x:1341,startPosition:2},0).wait(1).to({startPosition:2},0).wait(1).to({startPosition:2},0).wait(1).to({x:1084.05,startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({x:768.6,startPosition:2},0).to({startPosition:1},1).to({startPosition:1},1).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({startPosition:1},0).wait(1).to({x:837.1,y:892.15,startPosition:0},0).wait(1).to({x:768.6,y:892,startPosition:2},0).wait(3).to({x:743.4,startPosition:1},0).wait(4).to({x:550.8,y:892.15,startPosition:0},0).wait(4).to({x:508.2,startPosition:2},0).wait(5).to({x:404,y:891.45,startPosition:1},0).wait(4).to({x:232.75,y:893.6,startPosition:2},0).wait(4).to({x:-213.05,startPosition:1},0).to({_off:true},4).wait(749));

	// יד_שמאל
	this.instance_21 = new lib.ידשמאל("synched",0);
	this.instance_21.setTransform(-187.05,537.65,1,1,0,0,0,9.7,26.9);

	
	var _tweenStr_2 = cjs.Tween.get(this.instance_21).wait(1).to({x:-186.35,y:537.4},0).wait(1).to({x:-185.7,y:537.1},0).wait(1).to({x:-185,y:536.85},0).wait(1).to({x:-184.35,y:536.55},0).wait(1).to({x:-183.65,y:536.3},0).wait(1).to({x:-182.95,y:536.05},0).wait(1).to({x:-182.3,y:535.75},0).wait(1).to({x:-181.6,y:535.5},0).wait(1).to({x:-180.9,y:535.2},0).wait(1).to({x:-180.25,y:534.95},0).wait(1).to({x:-179.55,y:534.7},0).wait(1).to({x:-178.9,y:534.4},0).wait(1).to({x:-178.2,y:534.15},0).wait(1).to({x:-177.5,y:533.9},0).wait(1).to({x:-176.85,y:533.6},0).wait(1).to({x:-176.15,y:533.35},0).wait(1).to({x:-175.5,y:533.05},0).wait(1).to({x:-174.8,y:532.8},0).wait(1).to({x:-174.1,y:532.55},0).wait(1).to({x:-173.45,y:532.25},0).wait(1).to({x:-172.75,y:532},0).wait(1).to({x:-172.05,y:531.7},0).wait(1).to({x:-171.4,y:531.45},0).wait(1).to({x:-170.7,y:531.2},0).wait(1).to({x:-170.05,y:530.9},0).wait(1).to({x:-169.35,y:530.65},0).wait(1).to({x:-168.65,y:530.35},0).wait(1).to({x:-168,y:530.1},0).wait(1).to({x:-167.3,y:529.85},0).wait(1).to({x:-166.65,y:529.55},0).wait(1).to({x:-165.95,y:529.3},0).wait(1).to({x:-165.25,y:529},0).wait(1).to({x:-164.6,y:528.75},0).wait(1).to({x:-163.9,y:528.5},0).wait(1).to({x:-163.2,y:528.2},0).wait(1).to({x:-162.55,y:527.95},0).wait(1).to({x:-161.85,y:527.7},0).wait(1).to({x:-161.2,y:527.4},0).wait(1).to({x:-160.5,y:527.15},0).wait(1).to({x:-159.8,y:526.85},0).wait(1).to({x:-159.15,y:526.6},0).wait(1).to({x:-158.45,y:526.35},0).wait(1).to({x:-157.75,y:526.05},0).wait(1).to({x:-157.1,y:525.8},0).wait(1).to({x:-156.4,y:525.5},0).wait(1).to({x:-155.75,y:525.25},0).wait(1).to({x:-155.05,y:525},0).wait(1).to({x:-154.35,y:524.7},0).wait(1).to({x:-153.7,y:524.45},0).wait(1).to({x:-153,y:524.15},0).wait(1).to({x:-152.35,y:523.9},0).wait(1).to({x:-151.65,y:523.65},0).wait(1).to({x:-150.95,y:523.35},0).wait(1).to({x:-150.3,y:523.1},0).wait(1).to({x:-149.6,y:522.8},0).wait(1).to({x:-148.9,y:522.55},0).wait(1).to({x:-148.25,y:522.3},0).wait(1).to({x:-147.55,y:522},0).wait(1).to({x:-146.9,y:521.75},0).wait(1).to({x:-146.2,y:521.5},0).wait(1).to({x:-145.5,y:521.2},0).wait(1).to({x:-144.85,y:520.95},0).wait(1).to({x:-144.15,y:520.65},0).wait(1).to({x:-143.5,y:520.4},0).wait(1).to({x:-142.8,y:520.15},0).wait(1).to({x:-142.1,y:519.85},0).wait(1).to({x:-141.45,y:519.6},0).wait(1).to({x:-140.75,y:519.3},0).wait(1).to({x:-140.05,y:519.05},0).wait(1).to({x:-139.4,y:518.8},0).wait(1).to({x:-138.7,y:518.5},0).wait(1).to({x:-138.05,y:518.25},0).wait(1).to({x:-137.35,y:517.95},0).wait(1).to({x:-136.65,y:517.7},0).wait(1).to({x:-136,y:517.45},0).wait(1).to({x:-135.3,y:517.15},0).wait(1).to({x:-134.65,y:516.9},0).wait(1).to({x:-133.95,y:516.6},0).wait(1).to({x:-133.25,y:516.35},0).wait(1).to({x:-132.6,y:516.1},0).wait(1).to({x:-131.9,y:515.8},0).wait(1).to({x:-131.2,y:515.55},0).wait(1).to({x:-130.55,y:515.25},0).wait(1).to({x:-129.85,y:515},0).wait(1).to({x:-129.2,y:514.75},0).wait(1).to({x:-128.5,y:514.45},0).wait(1).to({x:-127.8,y:514.2},0).wait(1).to({x:-127.15,y:513.95},0).wait(1).to({x:-126.45,y:513.65},0).wait(1).to({x:-125.8,y:513.4},0).wait(1).to({x:-125.1,y:513.1},0).wait(1).to({x:-124.4,y:512.85},0).wait(1).to({x:-123.75,y:512.6},0).wait(1).to({x:-123.05,y:512.3},0).wait(1).to({x:-122.35,y:512.05},0).wait(1).to({x:-121.7,y:511.75},0).wait(1).to({x:-121,y:511.5},0).wait(1).to({x:-120.35,y:511.25},0).wait(1).to({x:-119.65,y:510.95},0).wait(1).to({x:-118.95,y:510.7},0).wait(1).to({x:-118.3,y:510.4},0).wait(1).to({x:-117.6,y:510.15},0).wait(1).to({x:-116.9,y:509.9},0).wait(1).to({x:-116.25,y:509.6},0).wait(1).to({x:-115.55,y:509.35},0).wait(1).to({x:-114.9,y:509.05},0).wait(1).to({x:-114.2,y:508.8},0).wait(1).to({x:-113.5,y:508.55},0).wait(1).to({x:-112.85,y:508.25},0).wait(1).to({x:-112.15,y:508},0).wait(1).to({x:-111.5,y:507.75},0).wait(1).to({x:-110.8,y:507.45},0).wait(1).to({x:-110.1,y:507.2},0).wait(1).to({x:-109.45,y:506.9},0).wait(1).to({x:-108.75,y:506.65},0).wait(1).to({x:-108.05,y:506.4},0).wait(1).to({x:-107.4,y:506.1},0).wait(1).to({x:-106.7,y:505.85},0).wait(1).to({x:-106.05,y:505.55},0).wait(1).to({x:-105.35,y:505.3},0).wait(1).to({regX:9.8,rotation:2.4995,x:-82.05,y:504.9},0).wait(1).to({rotation:4.9993,x:-58.75,y:504.5},0).wait(1).to({regY:26.8,rotation:7.499,x:-35.55,y:504.05},0).wait(1).to({regY:26.9,rotation:9.9982,x:-21.6,y:503.75},0).wait(1).to({rotation:12.4979,x:-7.75,y:503.3},0).wait(1).to({regY:27.1,rotation:14.9983,x:6.05,y:503},0).wait(1).to({regY:27,rotation:12.4972,x:70.7,y:503.25},0).wait(1).to({regY:27.1,rotation:9.9985,x:135.4,y:503.75},0).wait(1).to({rotation:7.4993,x:200.05,y:504.15},0).wait(1).to({rotation:4.9995,x:239.65,y:504.6},0).wait(1).to({regY:27,rotation:2.4987,x:279.1,y:504.85},0).wait(1).to({regX:9.7,regY:26.9,rotation:0,x:318.7,y:505.3},0).wait(1).to({regX:9.8,rotation:2.4995,x:348.85,y:504.9},0).wait(1).to({rotation:4.9993,x:378.9,y:504.5},0).wait(1).to({regY:26.8,rotation:7.499,x:409,y:504.05},0).wait(1).to({regY:26.9,rotation:9.9982,x:443.15,y:503.75},0).wait(1).to({rotation:12.4979,x:477.15,y:503.3},0).wait(1).to({regY:27.1,rotation:14.9983,x:511.2,y:503},0).wait(1).to({regX:9.7,regY:27,rotation:12.4972,x:536.6,y:503.25},0).wait(1).to({regX:9.8,regY:27.1,rotation:9.9985,x:562.2,y:503.75},0).wait(1).to({rotation:7.4993,x:587.7,y:504.15},0).wait(1).to({rotation:4.9995,x:641.95,y:504.6},0).wait(1).to({regY:27,rotation:2.4987,x:696.15,y:504.85},0).wait(1).to({regX:9.7,regY:26.9,rotation:0,x:750.4,y:505.3},0).wait(1).to({regX:9.8,rotation:2.4995,x:788.45,y:504.9},0).wait(1).to({rotation:4.9993,x:826.4,y:504.5},0).wait(1).to({regY:26.8,rotation:7.499,x:864.4,y:504.05},0).wait(1).to({regX:9.7,regY:26.9,rotation:9.9982,x:892.1,y:503.7},0).wait(1).to({regX:9.8,rotation:12.4979,x:919.85,y:503.25},0).wait(1).to({rotation:14.9983,x:947.6,y:502.8},0).wait(1).to({regX:9.7,rotation:12.4972,x:970.15,y:503.15},0).wait(1).to({regX:9.8,regY:27.1,rotation:9.9985,x:992.8,y:503.75},0).wait(1).to({rotation:7.4993,x:1015.4,y:504.15},0).wait(1).to({regY:27,rotation:4.9995,x:1046.75,y:504.55},0).wait(1).to({regY:26.9,rotation:2.4987,x:1078.15,y:504.8},0).wait(1).to({regX:9.7,rotation:0,x:1109.4,y:505.3},0).wait(1).to({regX:9.8,rotation:2.4995,x:1108.35,y:504.9},0).wait(1).to({rotation:4.9993,x:1107.2,y:504.5},0).wait(1).to({rotation:7.499,x:1106.05,y:504.15},0).wait(1).to({regX:9.7,rotation:9.9982,x:1104.85,y:503.7},0).wait(1).to({regX:9.8,rotation:12.4979,x:1103.75,y:503.25},0).wait(1).to({regX:9.7,rotation:14.9983,x:1102.55,y:502.75},0).wait(1).to({rotation:12.4972,x:1103.7,y:503.15},0).wait(1).to({regY:27.1,rotation:9.9985,x:1104.8,y:503.75},0).wait(1).to({regY:27,rotation:7.4993,x:1105.95,y:504.05},0).wait(1).to({rotation:4.9995,x:1107.1,y:504.55},0).wait(1).to({regY:26.9,rotation:2.4987,x:1108.3,y:504.75},0).wait(1).to({rotation:0,x:1109.4,y:505.3},0).wait(1).to({regX:9.8,rotation:2.4995,x:1108.35,y:504.9},0).wait(1).to({rotation:4.9993,x:1107.25,y:504.45},0).wait(1).to({rotation:7.499,x:1106.1,y:504.1},0).wait(1).to({regX:9.7,rotation:9.9982,x:1104.9,y:503.7},0).wait(1).to({regX:9.8,rotation:12.4979,x:1103.85,y:503.2},0).wait(1).to({regY:27,rotation:14.9983,x:1102.6,y:502.9},0).wait(1).to({regY:26.9,rotation:14.9982,x:1102.65,y:502.75},0).wait(1).to({startPosition:0},0).wait(1).to({x:1102.7,y:502.8},0).wait(1).to({regY:27.1,y:503},0).wait(1).to({startPosition:0},0).wait(1).to({regX:10,regY:26.9,rotation:14.9983,x:1102.85,y:502.85},0).wait(1).to({regX:10.1,regY:27,scaleX:0.9999,scaleY:0.9977,rotation:14.0424},0).wait(1).to({regY:26.9,scaleX:0.9998,scaleY:0.9955,rotation:13.0872,x:1102.8,y:502.55},0).wait(1).to({regX:10,scaleX:0.9997,scaleY:0.9932,rotation:12.1298,x:1102.5,y:502.25},0).wait(1).to({scaleX:0.9996,scaleY:0.9909,rotation:11.1739,x:1102.4,y:502.05},0).wait(1).to({scaleX:0.9995,scaleY:0.9887,rotation:10.218,x:1102.25,y:501.8},0).wait(1).to({scaleY:0.9864,rotation:9.2614,x:1102.1,y:501.6},0).wait(1).to({regX:10.1,scaleX:0.9993,scaleY:0.9842,rotation:8.3047,x:1102.15,y:501.4},0).wait(1).to({regX:9.9,scaleX:0.9992,scaleY:0.9819,rotation:7.3486,x:1101.8,y:501.2},0).wait(1).to({regX:10,scaleY:0.9797,rotation:6.3922,y:500.95},0).wait(1).to({scaleX:0.999,scaleY:0.9774,rotation:5.4367,x:1101.65,y:500.75},0).wait(1).to({regX:10.1,scaleX:0.9989,scaleY:0.9751,rotation:4.4793,x:1101.55,y:500.55},0).wait(1).to({regX:10,scaleY:0.9729,rotation:3.5239,x:1101.35,y:500.25},0).wait(1).to({regX:10.1,scaleX:0.9988,scaleY:0.9706,rotation:2.567,x:1101.4,y:500.15},0).wait(1).to({regX:10,scaleX:0.9987,scaleY:0.9684,rotation:1.6117,x:1101.15,y:499.95},0).wait(1).to({regX:10.1,scaleX:0.9986,scaleY:0.9661,rotation:0.657,x:1101.1,y:499.7},0).wait(1).to({regX:10,scaleX:0.9985,scaleY:0.9639,rotation:-0.2993,x:1100.95,y:499.45},0).wait(1).to({regY:27,scaleX:0.9984,scaleY:0.9616,rotation:-1.2538,x:1100.75,y:499.35},0).wait(1).to({regX:10.1,regY:26.9,scaleX:0.9983,scaleY:0.9594,rotation:-2.2114,x:1100.7,y:499.05},0).wait(1).to({regX:10,regY:27,scaleX:0.9982,scaleY:0.9571,rotation:-3.1668,x:1100.55,y:498.85},0).wait(1).to({regX:10.1,regY:26.9,scaleX:0.9981,scaleY:0.9549,rotation:-4.1238,x:1100.45,y:498.5},0).wait(1).to({regX:10,scaleY:0.9526,rotation:-5.0802,x:1100.2,y:498.3},0).wait(1).to({regX:10.1,scaleX:0.998,scaleY:0.9503,rotation:-6.036,y:498.1},0).wait(1).to({regX:10,scaleX:0.9979,scaleY:0.9481,rotation:-6.9925,x:1099.95,y:497.9},0).wait(1).to({regX:10.1,scaleX:0.9978,scaleY:0.9458,rotation:-7.9479,y:497.65},0).wait(1).to({scaleX:0.9977,scaleY:0.9435,rotation:-8.904,x:1099.85,y:497.55},0).wait(1).to({regY:27.1,scaleX:0.9976,scaleY:0.9413,rotation:-9.8602,x:1099.75,y:497.35},0).wait(1).to({regY:27,scaleX:0.9975,scaleY:0.9391,rotation:-10.8171,x:1099.6,y:497.05},0).wait(1).to({regY:26.9,scaleX:0.9974,scaleY:0.9368,rotation:-11.7724,x:1099.45,y:496.75},0).wait(1).to({scaleX:0.9973,scaleY:0.9346,rotation:-12.729,x:1099.4,y:496.55},0).wait(1).to({regY:27,scaleX:0.9972,scaleY:0.9323,rotation:-13.6858,x:1099.2,y:496.35},0).wait(1).to({regX:10,regY:27.1,scaleX:0.9971,scaleY:0.93,rotation:-14.6418,x:1099},0).wait(1).to({regY:27,scaleY:0.9278,rotation:-15.5979,x:1098.9,y:496},0).wait(1).to({regX:10.1,scaleX:0.9969,scaleY:0.9255,rotation:-16.5542,x:1098.8,y:495.8},0).wait(1).to({regX:10,regY:26.9,scaleY:0.9233,rotation:-17.509,x:1098.55,y:495.5},0).wait(1).to({regY:27.1,scaleX:0.9968,scaleY:0.9211,rotation:-18.4662,x:1098.5,y:495.45},0).wait(1).to({regY:27,scaleX:0.9967,scaleY:0.9188,rotation:-19.422,x:1098.35,y:495.1},0).wait(1).to({regY:27.1,scaleX:0.9966,scaleY:0.9165,rotation:-20.3783,x:1098.3,y:495},0).wait(1).to({regX:10.1,regY:27,scaleX:0.9965,scaleY:0.9142,rotation:-21.3344,x:1098.25,y:494.7},0).wait(1).to({regX:10,scaleX:0.9964,scaleY:0.912,rotation:-22.2902,x:1097.95,y:494.4},0).wait(1).to({regY:26.9,scaleX:0.9963,scaleY:0.9098,rotation:-23.247,x:1097.85,y:494.15},0).wait(1).to({regX:10.1,regY:27.2,scaleX:0.9962,scaleY:0.9075,rotation:-24.2029},0).wait(1).to({regX:10,regY:27,scaleX:0.9961,scaleY:0.9052,rotation:-25.1599,x:1097.65,y:493.85},0).wait(1).to({regX:10.1,regY:27.1,scaleX:0.996,scaleY:0.903,rotation:-26.1147,x:1097.6,y:493.55},0).wait(1).to({regX:10,scaleY:0.9007,rotation:-27.0725,x:1097.4,y:493.45},0).wait(1).to({regX:10.1,regY:26.9,scaleX:0.9959,scaleY:0.8984,rotation:-28.027,x:1097.3,y:493.05},0).wait(1).to({regY:27,scaleX:0.9958,scaleY:0.8962,rotation:-28.9849,x:1097.25,y:492.9},0).wait(1).to({regX:10,scaleX:0.9957,scaleY:0.8939,rotation:-29.9404,x:1097,y:492.75},0).wait(1).to({regY:26.9,scaleX:0.9956,scaleY:0.8917,rotation:-30.8952,x:1096.8,y:492.5},0).wait(1).to({regY:27,scaleX:0.9955,scaleY:0.8894,rotation:-31.8534,x:1096.7,y:492.25},0).wait(1).to({regY:27.1,scaleX:0.9954,scaleY:0.8872,rotation:-32.8086,x:1096.65,y:492.15},0).wait(1).to({scaleX:0.9953,scaleY:0.8849,rotation:-33.7654,x:1096.5,y:491.9},0).wait(1).to({regY:26.9,scaleX:0.9952,scaleY:0.8827,rotation:-34.7208,x:1096.3,y:491.6},0).wait(1).to({regY:27.1,scaleX:0.9951,scaleY:0.8804,rotation:-35.6776,x:1096.25,y:491.5},0).wait(1).to({scaleX:0.995,scaleY:0.8782,rotation:-36.6324,x:1096.15,y:491.3},0).wait(1).to({scaleY:0.8759,rotation:-37.5892,x:1096.05,y:491.1},0).wait(1).to({regX:10.1,regY:26.9,scaleX:0.9949,scaleY:0.8736,rotation:-38.5451,x:1095.85,y:490.6},0).wait(1).to({regY:27.1,scaleX:0.9948,scaleY:0.8714,rotation:-39.5019,y:490.5},0).wait(1).to({regX:10,regY:27,scaleX:0.9947,scaleY:0.8691,rotation:-40.4573,x:1095.6,y:490.35},0).wait(1).to({scaleX:0.9946,scaleY:0.8669,rotation:-41.4149,x:1095.45,y:490.05},0).wait(1).to({scaleX:0.9945,scaleY:0.8646,rotation:-42.3701,x:1095.3,y:489.9},0).wait(1).to({regY:27.1,scaleX:0.9944,scaleY:0.8624,rotation:-43.3273,y:489.75},0).wait(1).to({scaleX:0.9943,scaleY:0.8601,rotation:-44.2827,x:1095.15,y:489.55},0).wait(1).to({regY:27,scaleX:0.9942,scaleY:0.8579,rotation:-45.2385,x:1095,y:489.25},0).wait(1).to({regX:10.2,regY:27.4,scaleY:0.8557,rotation:-46.1951,x:1094.7,y:489.15},0).wait(1).to({scaleX:0.9941,scaleY:0.8556,rotation:-50.4799,x:1094.75},0).wait(1).to({regY:27.5,rotation:-54.7664,x:1094.85},0).wait(1).to({rotation:-59.0531,x:1094.9,y:489.1},0).wait(1).to({regY:27.4,rotation:-63.3381,x:1094.8,y:489.05},0).wait(1).to({scaleX:0.9942,rotation:-67.624,x:1094.85,y:489},0).wait(1).to({scaleX:0.9941,rotation:-71.9102,x:1094.9,y:489.05},0).wait(1).to({regY:27.5,scaleX:0.9942,rotation:-76.1955,x:1094.8},0).wait(1).to({regX:10.1,regY:27.6,scaleX:1.0235,scaleY:0.7914,rotation:-76.1939,x:1094.85,y:489.15},0).wait(1).to({regY:27.7,scaleX:1.0528,scaleY:0.7271,x:1094.95,y:489.2},0).wait(1).to({regX:10.2,regY:27.6,scaleX:1.0821,scaleY:0.6628,rotation:-76.1947,x:1094.9,y:489.05},0).wait(1).to({regX:10.1,scaleX:1.1114,scaleY:0.5985,rotation:-76.1944,x:1094.85,y:489.2},0).wait(1).to({regX:10.2,regY:27.7,scaleX:1.1407,scaleY:0.5343,x:1094.9,y:489.1},0).wait(1).to({regX:10.1,regY:27.4,scaleX:1.1701,scaleY:0.47,rotation:-76.1947,x:1094.7,y:489.05},0).wait(1).to({regX:10.2,regY:27.6,scaleX:1.1962,scaleY:0.4667,rotation:-76.1945,x:1093.8,y:488.95},0).wait(1).to({regX:10.1,scaleX:1.2222,scaleY:0.4635,rotation:-76.1939,x:1092.7,y:489.1},0).wait(1).to({scaleX:1.2483,scaleY:0.4603,rotation:-76.1946,x:1091.75},0).wait(1).to({regY:27.4,scaleX:1.2744,scaleY:0.457,rotation:-76.1948,x:1090.6,y:489.05},0).wait(1).to({scaleX:1.3005,scaleY:0.4538,rotation:-76.1955,x:1089.55},0).wait(1).to({regX:9,regY:14.1,scaleX:1.3267,scaleY:0.4506,rotation:-76.1953,x:1088.5},0).wait(1).to({regY:14.2,scaleX:1.3266,rotation:-76.9446,x:1088.6,y:489.1},0).wait(1).to({regY:14.1,scaleY:0.4505,rotation:-77.6964,x:1088.55,y:489.15},0).wait(1).to({regY:14.2,rotation:-78.4461,y:489.2},0).wait(1).to({regY:14.3,scaleY:0.4506,rotation:-79.1958,x:1088.65,y:489.15},0).wait(1).to({regY:14.1,rotation:-79.9456,x:1088.55,y:489.25},0).wait(1).to({regX:8.8,regY:14.2,scaleX:1.3267,rotation:-80.6959,x:1088.5,y:489.35},0).wait(1).to({scaleX:1.3266,rotation:-79.7861,y:489.4},0).wait(1).to({rotation:-78.8773,x:1088.55,y:489.35},0).wait(1).to({regY:14.3,scaleY:0.4505,rotation:-77.9681,x:1088.6,y:489.45},0).wait(1).to({regY:14.4,scaleY:0.4506,rotation:-77.058,x:1088.55,y:489.4},0).wait(1).to({regY:14.2,scaleY:0.4505,rotation:-76.1478,y:489.45},0).wait(1).to({regY:14.1,rotation:-75.239,x:1088.45,y:489.3},0).wait(1).to({regY:14.4,scaleY:0.4865,rotation:-67.162,x:1091,y:489.1},0).wait(1).to({regY:14.2,scaleY:0.5224,rotation:-59.0856,x:1093.3,y:488.8},0).wait(1).to({regY:14.3,scaleY:0.5584,rotation:-51.0094,x:1095.65,y:488.6},0).wait(1).to({scaleY:0.5943,rotation:-42.9328,x:1098.05,y:488.35},0).wait(1).to({scaleY:0.6303,rotation:-34.8585,x:1100.4,y:488.1},0).wait(1).to({regY:14.2,scaleY:0.6663,rotation:-26.7822,x:1102.65,y:487.8},0).wait(1).to({scaleX:1.2856,scaleY:0.6775,rotation:-19.0246,x:1102.75},0).wait(1).to({scaleX:1.2446,scaleY:0.6887,rotation:-11.2671,x:1102.7,y:487.9},0).wait(1).to({scaleX:1.2036,scaleY:0.7,rotation:-3.5092,x:1102.75},0).wait(1).to({scaleX:1.1626,scaleY:0.7112,rotation:4.2459,y:487.95},0).wait(1).to({regY:14.1,scaleX:1.1217,scaleY:0.7225,rotation:12.0031,x:1102.8,y:487.9},0).wait(1).to({regX:9.1,regY:14.4,scaleX:1.0807,scaleY:0.7338,rotation:19.7617,x:1102.85,y:487.95},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({regY:14.5,scaleY:0.7337,rotation:19.7614},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({regY:14.3,x:1102.9,y:487.85},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({regY:14.5,y:488},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({regY:14.3,x:1102.95,y:487.9},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({regX:9.2,regY:14.4,x:1103.1,y:488.05},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({regX:9.1,regY:14.5,x:1102.95,y:488.1},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1);
	this.timeline.addTween(_tweenStr_2.to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({regX:9.2,regY:14.6,scaleY:0.7338,rotation:19.7617,x:1102.9,y:488.15},0).wait(1).to({scaleY:0.7337,rotation:17.2619,y:488.2},0).wait(1).to({regY:14.5,rotation:14.7613,x:1102.95,y:488.05},0).wait(1).to({regY:14.6,rotation:12.2615},0).wait(1).to({rotation:9.7618,x:1102.9,y:488},0).wait(1).to({rotation:7.2617},0).wait(1).to({regX:9.1,regY:14.4,rotation:4.7621,x:1114.35,y:487.95},0).wait(1).to({regY:14.5,rotation:7.2616,x:1127.15,y:488.05},0).wait(1).to({regX:9.2,regY:14.6,rotation:9.7616,x:1139.9,y:488.15},0).wait(1).to({regX:9.1,regY:14.5,rotation:12.2615,x:1152.55,y:488.05},0).wait(1).to({rotation:14.7608,x:1165.2},0).wait(1).to({regY:14.4,rotation:17.26,x:1177.95,y:488},0).wait(1).to({regX:9.3,regY:14.5,rotation:19.761,x:1190.55,y:488.05},0).wait(1).to({x:1208.45},0).wait(1).to({x:1226.35},0).wait(1).to({x:1244.25},0).wait(1).to({regX:9.4,scaleX:1.0806,rotation:19.7611,x:1262.25},0).wait(1).to({x:1280.15},0).wait(1).to({x:1298.05},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({x:1298.1},0).wait(1).to({x:1316.35},0).wait(1).to({x:1334.6},0).wait(1).to({x:1352.85},0).wait(1).to({x:1371.05},0).wait(1).to({x:1389.3},0).wait(1).to({scaleX:1.0807,rotation:19.761,x:1407.5,y:488.1},0).wait(1).to({regX:9.3,regY:14.3,scaleX:1.0806,rotation:0,skewX:18.2409,skewY:25.1625,x:1427.7,y:487.95},0).wait(1).to({regX:9.4,skewX:16.7217,skewY:30.5649,x:1448.05,y:488},0).wait(1).to({regX:9.3,regY:14.5,skewX:15.201,skewY:35.9693,x:1468.1,y:488.1},0).wait(1).to({regY:14.4,skewX:13.6814,skewY:41.3706,x:1488.3,y:488},0).wait(1).to({regX:9.4,regY:14.3,skewX:12.1615,skewY:46.7754,x:1508.65},0).wait(1).to({regX:9.3,regY:14.5,skewX:10.6399,skewY:52.1799,x:1528.75,y:488.1},0).wait(1).to({regY:14.3,skewX:9.1207,skewY:57.5816,y:487.95},0).wait(1).to({regY:14.4,scaleX:1.0807,skewX:7.5994,skewY:62.9849,y:488},0).wait(1).to({regY:14.3,skewX:6.0802,skewY:68.3895,x:1528.8,y:487.95},0).wait(1).to({regX:9.2,regY:14.6,skewX:4.5602,skewY:73.7911,x:1528.75,y:488.1},0).wait(1).to({regX:9.4,regY:14.3,skewX:3.0388,skewY:79.1954},0).wait(1).to({regX:10,regY:13.7,scaleX:1.0806,skewX:1.5194,skewY:84.5983,x:1528.85,y:488.25},0).wait(1).to({regX:1528.8,regY:-115200,scaleX:0,scaleY:0,skewX:0,skewY:0,x:-1528.8,y:-83337.95},0).wait(1).to({regX:9.2,regY:14.7,scaleX:1.0806,scaleY:0.7337,skewX:-1.5194,skewY:95.4017,x:1528.75,y:488.2},0).wait(1).to({regY:14.5,scaleX:1.0807,skewX:-3.0388,skewY:100.8046,x:1528.8,y:488},0).wait(1).to({regY:14.7,skewX:-4.5602,skewY:106.2089,x:1528.75,y:488.2},0).wait(1).to({regY:14.6,skewX:-6.0802,skewY:111.6105,x:1528.8,y:488.1},0).wait(1).to({regX:9.3,regY:14.5,skewX:-7.5994,skewY:117.0151,x:1528.75,y:488.15},0).wait(1).to({regX:9.2,scaleX:1.0806,skewX:-9.1207,skewY:122.4184,x:1528.85,y:488.05},0).wait(1).to({regY:14.7,skewX:-10.6399,skewY:127.8201,y:488.2},0).wait(1).to({regY:14.5,skewX:-12.1615,skewY:133.2246,y:488.05},0).wait(1).to({regX:9.3,skewX:-13.6814,skewY:138.6294,x:1528.75,y:488.15},0).wait(1).to({regX:9.2,skewX:-15.201,skewY:144.0307,x:1528.85,y:488.1},0).wait(1).to({skewX:-16.7217,skewY:149.4351},0).wait(1).to({skewX:-18.2409,skewY:154.8375,y:488.15},0).wait(1).to({regX:9.3,regY:14.6,scaleX:1.0807,skewX:-19.761,skewY:160.2398,x:1528.9},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({scaleX:1.0806,skewX:-19.7611,skewY:160.241,x:1528.85},0).wait(1).to({regX:9.2,regY:14.7,x:1528.95},0).wait(1).to({regX:9.3,regY:14.6,scaleX:1.0807,skewX:-19.761,skewY:160.2398,x:1522.3},0).wait(1).to({regX:9.2,regY:14.7,scaleX:1.0806,skewX:-19.7611,skewY:160.241,x:1522.35},0).wait(1).to({x:1522.3},0).wait(1).to({regX:9.3,regY:14.6,scaleX:1.0807,skewX:-19.761,skewY:160.2398},0).wait(1).to({scaleX:1.0806,skewX:-19.7611,skewY:160.241,x:1522.25},0).wait(1).to({regX:9.2,regY:14.7,x:1522.45},0).wait(1).to({regX:9.3,regY:14.6,scaleX:1.0807,skewX:-19.761,skewY:160.2398,x:1395.35},0).wait(1).to({regX:9.2,regY:14.7,scaleX:1.0806,skewX:-19.7611,skewY:160.241,x:1395.4},0).wait(1).to({x:1395.35},0).wait(1).to({regX:9.3,regY:14.6,scaleX:1.0807,skewX:-19.761,skewY:160.2398},0).wait(1).to({regX:9.2,regY:14.7,scaleX:1.0806,skewX:-19.7611,skewY:160.241,x:1395.5},0).wait(1).to({regX:9.3,regY:14.6,x:1395.35,y:488.2},0).wait(1).to({regX:9.2,regY:14.7,scaleX:1.0807,skewX:-19.761,skewY:160.2398,x:1138.55,y:488.15},0).to({regX:9.3,regY:14.6,x:1138.4},1).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({x:822.95},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({x:884.1},0).wait(1).to({x:822.95},0).wait(3).to({x:797.75},0).wait(4).to({x:597.8},0).wait(4).to({x:555.2},0).wait(5).to({skewX:-34.7602,skewY:145.2419,x:463.6},0).wait(4).to({scaleX:1.0806,skewX:-19.7603,skewY:160.243,x:288},0).wait(4).to({x:-157.8},0).to({_off:true},4).wait(749));

	// לא__לשכוח_לשתות_מים
	this.instance_22 = new lib.CachedBmp_3();
	this.instance_22.setTransform(236.25,467.9,0.5,0.5);

	this.instance_23 = new lib.CachedBmp_4();
	this.instance_23.setTransform(236.25,467.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_22}]}).to({state:[{t:this.instance_23}]},492).to({state:[]},743).wait(29));

	// מטבח
	this.instance_24 = new lib.CachedBmp_5();
	this.instance_24.setTransform(-793.5,-48.75,0.5,0.5);

	this.instance_25 = new lib.CachedBmp_6();
	this.instance_25.setTransform(-793.5,-48.75,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_24}]}).to({state:[{t:this.instance_25}]},492).to({state:[]},743).wait(29));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(166.5,491.3,2709,946);
// library properties:
lib.properties = {
	id: 'A28E4E241AD74E9CB68AABA3A51A20A4',
	width: 1920,
	height: 1080,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_6.png?1650711184644", id:"CachedBmp_6"},
		{src:"images/CachedBmp_5.png?1650711184644", id:"CachedBmp_5"},
		{src:"images/גורל הבקבוק סופי_1_atlas_1.png?1650711184363", id:"גורל הבקבוק סופי_1_atlas_1"},
		{src:"images/גורל הבקבוק סופי_1_atlas_2.png?1650711184363", id:"גורל הבקבוק סופי_1_atlas_2"},
		{src:"sounds/SUOND4wav.mp3?1650711184644", id:"SUOND4wav"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['A28E4E241AD74E9CB68AABA3A51A20A4'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;