if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/scrollview-base/scrollview-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/scrollview-base/scrollview-base.js",
    code: []
};
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].code=["YUI.add('scrollview-base', function (Y, NAME) {","","/**"," * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators"," *"," * @module scrollview"," * @submodule scrollview-base"," */",""," // Local vars","var getClassName = Y.ClassNameManager.getClassName,","    DOCUMENT = Y.config.doc,","    IE = Y.UA.ie,","    NATIVE_TRANSITIONS = Y.Transition.useNative,","    vendorPrefix = Y.Transition._VENDOR_PREFIX, // Todo: This is a private property, and alternative approaches should be investigated","    SCROLLVIEW = 'scrollview',","    CLASS_NAMES = {","        vertical: getClassName(SCROLLVIEW, 'vert'),","        horizontal: getClassName(SCROLLVIEW, 'horiz')","    },","    EV_SCROLL_END = 'scrollEnd',","    FLICK = 'flick',","    DRAG = 'drag',","    MOUSEWHEEL = 'mousewheel',","    UI = 'ui',","    TOP = 'top',","    LEFT = 'left',","    PX = 'px',","    AXIS = 'axis',","    SCROLL_Y = 'scrollY',","    SCROLL_X = 'scrollX',","    BOUNCE = 'bounce',","    DISABLED = 'disabled',","    DECELERATION = 'deceleration',","    DIM_X = 'x',","    DIM_Y = 'y',","    BOUNDING_BOX = 'boundingBox',","    CONTENT_BOX = 'contentBox',","    GESTURE_MOVE = 'gesturemove',","    START = 'start',","    END = 'end',","    EMPTY = '',","    ZERO = '0s',","    SNAP_DURATION = 'snapDuration',","    SNAP_EASING = 'snapEasing',","    EASING = 'easing',","    FRAME_DURATION = 'frameDuration',","    BOUNCE_RANGE = 'bounceRange',","    NESTING = 'nesting',","","    _constrain = function (val, min, max) {","        return Math.min(Math.max(val, min), max);","    };","","/**"," * ScrollView provides a scrollable widget, supporting flick gestures,"," * across both touch and mouse based devices."," *"," * @class ScrollView"," * @param config {Object} Object literal with initial attribute values"," * @extends Widget"," * @constructor"," */","function ScrollView() {","    ScrollView.superclass.constructor.apply(this, arguments);","}","","Y.ScrollView = Y.extend(ScrollView, Y.Widget, {","","    // *** Y.ScrollView prototype","","    /**","     * Flag driving whether or not we should try and force H/W acceleration when transforming. Currently enabled by default for Webkit.","     * Used by the _transform method.","     *","     * @property _forceHWTransforms","     * @type boolean","     * @protected","     */","    _forceHWTransforms: Y.UA.webkit ? true : false,","","    /**","     * <p>Used to control whether or not ScrollView's internal","     * gesturemovestart, gesturemove and gesturemoveend","     * event listeners should preventDefault. The value is an","     * object, with \"start\", \"move\" and \"end\" properties used to","     * specify which events should preventDefault and which shouldn't:</p>","     *","     * <pre>","     * {","     *    start: false,","     *    move: true,","     *    end: false","     * }","     * </pre>","     *","     * <p>The default values are set up in order to prevent panning,","     * on touch devices, while allowing click listeners on elements inside","     * the ScrollView to be notified as expected.</p>","     *","     * @property _prevent","     * @type Object","     * @protected","     */","    _prevent: {","        start: false,","        move: true,","        end: false","    },","","    /**","     * Contains the distance (postive or negative) in pixels by which","     *  the scrollview was last scrolled. This is useful when setting up","     *  click listeners on the scrollview content, which on mouse based","     *  devices are always fired, even after a drag/flick.","     *","     * <p>Touch based devices don't currently fire a click event,","     *  if the finger has been moved (beyond a threshold) so this","     *  check isn't required, if working in a purely touch based environment</p>","     *","     * @property lastScrolledAmt","     * @type Number","     * @public","     * @default 0","     */","    lastScrolledAmt: 0,","","    /**","     * Internal state, defines the minimum amount that the scrollview can be scrolled along the X axis","     *","     * @property _minScrollX","     * @type number","     * @protected","     */","    _minScrollX: null,","","    /**","     * Internal state, defines the maximum amount that the scrollview can be scrolled along the X axis","     *","     * @property _maxScrollX","     * @type number","     * @protected","     */","    _maxScrollX: null,","","    /**","     * Internal state, defines the minimum amount that the scrollview can be scrolled along the Y axis","     *","     * @property _minScrollY","     * @type number","     * @protected","     */","    _minScrollY: null,","","    /**","     * Internal state, defines the maximum amount that the scrollview can be scrolled along the Y axis","     *","     * @property _maxScrollY","     * @type number","     * @protected","     */","    _maxScrollY: null,","    ","    /**","     * Designated initializer","     *","     * @method initializer","     * @param {config} Configuration object for the plugin","     */","    initializer: function () {","        var sv = this;","","        // Cache these values, since they aren't going to change.","        sv._bb = sv.get(BOUNDING_BOX);","        sv._cb = sv.get(CONTENT_BOX);","","        // Cache some attributes","        sv._cAxis = sv.get(AXIS);","        sv._cBounce = sv.get(BOUNCE);","        sv._cBounceRange = sv.get(BOUNCE_RANGE);","        sv._cDeceleration = sv.get(DECELERATION);","        sv._cFrameDuration = sv.get(FRAME_DURATION);","        sv._cNesting = sv.get(NESTING);","    },","","    /**","     * bindUI implementation","     *","     * Hooks up events for the widget","     * @method bindUI","     */","    bindUI: function () {","        var sv = this;","","        // Bind interaction listers","        sv._bindFlick(sv.get(FLICK));","        sv._bindDrag(sv.get(DRAG));","        sv._bindMousewheel(true);","        ","        // Bind change events","        sv._bindAttrs();","","        // IE SELECT HACK. See if we can do this non-natively and in the gesture for a future release.","        if (IE) {","            sv._fixIESelect(sv._bb, sv._cb);","        }","","        // Set any deprecated static properties","        if (ScrollView.SNAP_DURATION) {","            sv.set(SNAP_DURATION, ScrollView.SNAP_DURATION);","        }","","        if (ScrollView.SNAP_EASING) {","            sv.set(SNAP_EASING, ScrollView.SNAP_EASING);","        }","","        if (ScrollView.EASING) {","            sv.set(EASING, ScrollView.EASING);","        }","","        if (ScrollView.FRAME_STEP) {","            sv.set(FRAME_DURATION, ScrollView.FRAME_STEP);","        }","","        if (ScrollView.BOUNCE_RANGE) {","            sv.set(BOUNCE_RANGE, ScrollView.BOUNCE_RANGE);","        }","","        // Recalculate dimension properties","        // TODO: This should be throttled.","        // Y.one(WINDOW).after('resize', sv._afterDimChange, sv);","    },","","    /**","     * Bind event listeners","     *","     * @method _bindAttrs","     * @private","     */","    _bindAttrs: function () {","        var sv = this,","            scrollChangeHandler = sv._afterScrollChange,","            dimChangeHandler = sv._afterDimChange;","","        // Bind any change event listeners","        sv.after({","            'scrollEnd': sv._afterScrollEnd,","            'disabledChange': sv._afterDisabledChange,","            'flickChange': sv._afterFlickChange,","            'dragChange': sv._afterDragChange,","            'axisChange': sv._afterAxisChange,","            'scrollYChange': scrollChangeHandler,","            'scrollXChange': scrollChangeHandler,","            'heightChange': dimChangeHandler,","            'widthChange': dimChangeHandler","        });","    },","","    /**","     * Bind (or unbind) gesture move listeners required for drag support","     *","     * @method _bindDrag","     * @param drag {boolean} If true, the method binds listener to enable","     *  drag (gesturemovestart). If false, the method unbinds gesturemove","     *  listeners for drag support.","     * @private","     */","    _bindDrag: function (drag) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'drag' listeners","        bb.detach(DRAG + '|*');","","        if (drag) {","            bb.on(DRAG + '|' + GESTURE_MOVE + START, Y.bind(sv._onGestureMoveStart, sv));","        }","    },","","    /**","     * Bind (or unbind) flick listeners.","     *","     * @method _bindFlick","     * @param flick {Object|boolean} If truthy, the method binds listeners for","     *  flick support. If false, the method unbinds flick listeners.","     * @private","     */","    _bindFlick: function (flick) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'flick' listeners","        bb.detach(FLICK + '|*');","","        if (flick) {","            bb.on(FLICK + '|' + FLICK, Y.bind(sv._flick, sv), flick);","","            // Rebind Drag, becuase _onGestureMoveEnd always has to fire -after- _flick","            sv._bindDrag(sv.get(DRAG));","        }","    },","","    /**","     * Bind (or unbind) mousewheel listeners.","     *","     * @method _bindMousewheel","     * @param mousewheel {Object|boolean} If truthy, the method binds listeners for","     *  mousewheel support. If false, the method unbinds mousewheel listeners.","     * @private","     */","    _bindMousewheel: function (mousewheel) {","        var sv = this,","            bb = sv._bb;","","        // Unbind any previous 'mousewheel' listeners","        // TODO: This doesn't actually appear to work properly. Fix. #2532743","        bb.detach(MOUSEWHEEL + '|*');","","        // Only enable for vertical scrollviews","        if (mousewheel) {","            // Bound to document, because that's where mousewheel events fire off of.","            Y.one(DOCUMENT).on(MOUSEWHEEL, Y.bind(sv._mousewheel, sv));","        }","    },","","    /**","     * syncUI implementation.","     *","     * Update the scroll position, based on the current value of scrollX/scrollY.","     *","     * @method syncUI","     */","    syncUI: function () {","        var sv = this,","            scrollDims = sv._getScrollDims(),","            width = scrollDims.offsetWidth,","            height = scrollDims.offsetHeight,","            scrollWidth = scrollDims.scrollWidth,","            scrollHeight = scrollDims.scrollHeight;","","        // If the axis is undefined, auto-calculate it","        if (sv._cAxis === undefined) {","            // This should only ever be run once (for now).","            // In the future SV might post-load axis changes","            sv._cAxis = {","                x: (scrollWidth > width),","                y: (scrollHeight > height)","            };","","            sv._set(AXIS, sv._cAxis);","        }","        ","        // get text direction on or inherited by scrollview node","        sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');","","        // Cache the disabled value","        sv._cDisabled = sv.get(DISABLED);","","        // Run this to set initial values","        sv._uiDimensionsChange();","","        // If we're out-of-bounds, snap back.","        if (sv._isOutOfBounds()) {","            sv._snapBack();","        }","    },","","    /**","     * Utility method to obtain widget dimensions","     *","     * @method _getScrollDims","     * @return {Object} The offsetWidth, offsetHeight, scrollWidth and","     *  scrollHeight as an array: [offsetWidth, offsetHeight, scrollWidth,","     *  scrollHeight]","     * @private","     */","    _getScrollDims: function () {","        var sv = this,","            cb = sv._cb,","            bb = sv._bb,","            TRANS = ScrollView._TRANSITION,","            // Ideally using CSSMatrix - don't think we have it normalized yet though.","            // origX = (new WebKitCSSMatrix(cb.getComputedStyle(\"transform\"))).e,","            // origY = (new WebKitCSSMatrix(cb.getComputedStyle(\"transform\"))).f,","            origX = sv.get(SCROLL_X),","            origY = sv.get(SCROLL_Y),","            origHWTransform,","            dims;","","        // TODO: Is this OK? Just in case it's called 'during' a transition.","        if (NATIVE_TRANSITIONS) {","            cb.setStyle(TRANS.DURATION, ZERO);","            cb.setStyle(TRANS.PROPERTY, EMPTY);","        }","","        origHWTransform = sv._forceHWTransforms;","        sv._forceHWTransforms = false; // the z translation was causing issues with picking up accurate scrollWidths in Chrome/Mac.","","        sv._moveTo(cb, 0, 0);","        dims = {","            'offsetWidth': bb.get('offsetWidth'),","            'offsetHeight': bb.get('offsetHeight'),","            'scrollWidth': bb.get('scrollWidth'),","            'scrollHeight': bb.get('scrollHeight')","        };","        sv._moveTo(cb, -(origX), -(origY));","","        sv._forceHWTransforms = origHWTransform;","","        return dims;","    },","","    /**","     * This method gets invoked whenever the height or width attributes change,","     * allowing us to determine which scrolling axes need to be enabled.","     *","     * @method _uiDimensionsChange","     * @protected","     */","    _uiDimensionsChange: function () {","        var sv = this,","            bb = sv._bb,","            scrollDims = sv._getScrollDims(),","            width = scrollDims.offsetWidth,","            height = scrollDims.offsetHeight,","            scrollWidth = scrollDims.scrollWidth,","            scrollHeight = scrollDims.scrollHeight,","            rtl = sv.rtl,","            svAxis = sv._cAxis,","            minScrollX = (rtl ? Math.min(0, -(scrollWidth - width)) : 0),","            maxScrollX = (rtl ? 0 : Math.max(0, scrollWidth - width)),","            minScrollY = 0,","            maxScrollY = Math.max(0, scrollHeight - height);","            ","        if (svAxis && svAxis.x) {","            bb.addClass(CLASS_NAMES.horizontal);","        }","","        if (svAxis && svAxis.y) {","            bb.addClass(CLASS_NAMES.vertical);","        }","","        sv._setBounds({","            minScrollX: minScrollX,","            maxScrollX: maxScrollX,","            minScrollY: minScrollY,","            maxScrollY: maxScrollY","        });","    },","","    /**","     * Set the bounding dimensions of the ScrollView","     *","     * @method _setBounds","     * @protected","     * @param bounds {Object} [duration] ms of the scroll animation. (default is 0)","     *   @param {Number} [bounds.minScrollX] The minimum scroll X value","     *   @param {Number} [bounds.maxScrollX] The maximum scroll X value","     *   @param {Number} [bounds.minScrollY] The minimum scroll Y value","     *   @param {Number} [bounds.maxScrollY] The maximum scroll Y value","     */","    _setBounds: function (bounds) {","        var sv = this;","        ","        // TODO: Do a check to log if the bounds are invalid","","        sv._minScrollX = bounds.minScrollX;","        sv._maxScrollX = bounds.maxScrollX;","        sv._minScrollY = bounds.minScrollY;","        sv._maxScrollY = bounds.maxScrollY;","    },","","    /**","     * Get the bounding dimensions of the ScrollView","     *","     * @method _getBounds","     * @protected","     */","    _getBounds: function () {","        var sv = this;","        ","        return {","            minScrollX: sv._minScrollX,","            maxScrollX: sv._maxScrollX,","            minScrollY: sv._minScrollY,","            maxScrollY: sv._maxScrollY","        };","","    },","","    /**","     * Scroll the element to a given xy coordinate","     *","     * @method scrollTo","     * @param x {Number} The x-position to scroll to. (null for no movement)","     * @param y {Number} The y-position to scroll to. (null for no movement)","     * @param {Number} [duration] ms of the scroll animation. (default is 0)","     * @param {String} [easing] An easing equation if duration is set. (default is `easing` attribute)","     * @param {String} [node] The node to transform.  Setting this can be useful in","     *  dual-axis paginated instances. (default is the instance's contentBox)","     */","    scrollTo: function (x, y, duration, easing, node) {","        // Check to see if widget is disabled","        if (this._cDisabled) {","            return;","        }","","        var sv = this,","            cb = sv._cb,","            TRANS = ScrollView._TRANSITION,","            callback = Y.bind(sv._onTransEnd, sv), // @Todo : cache this","            newX = 0,","            newY = 0,","            transition = {},","            transform;","","        // default the optional arguments","        duration = duration || 0;","        easing = easing || sv.get(EASING); // @TODO: Cache this","        node = node || cb;","","        if (x !== null) {","            sv.set(SCROLL_X, x, {src:UI});","            newX = -(x);","        }","","        if (y !== null) {","            sv.set(SCROLL_Y, y, {src:UI});","            newY = -(y);","        }","","        transform = sv._transform(newX, newY);","","        if (NATIVE_TRANSITIONS) {","            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.","            node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);","        }","","        // Move","        if (duration === 0) {","            if (NATIVE_TRANSITIONS) {","                node.setStyle('transform', transform);","            }","            else {","                // TODO: If both set, batch them in the same update","                // Update: Nope, setStyles() just loops through each property and applies it.","                if (x !== null) {","                    node.setStyle(LEFT, newX + PX);","                }","                if (y !== null) {","                    node.setStyle(TOP, newY + PX);","                }","            }","        }","","        // Animate","        else {","            transition.easing = easing;","            transition.duration = duration / 1000;","","            if (NATIVE_TRANSITIONS) {","                transition.transform = transform;","            }","            else {","                transition.left = newX + PX;","                transition.top = newY + PX;","            }","","            node.transition(transition, callback);","        }","    },","","    /**","     * Utility method, to create the translate transform string with the","     * x, y translation amounts provided.","     *","     * @method _transform","     * @param {Number} x Number of pixels to translate along the x axis","     * @param {Number} y Number of pixels to translate along the y axis","     * @private","     */","    _transform: function (x, y) {","        // TODO: Would we be better off using a Matrix for this?","        var prop = 'translate(' + x + 'px, ' + y + 'px)';","","        if (this._forceHWTransforms) {","            prop += ' translateZ(0)';","        }","","        return prop;","    },","","    /**","    * Utility method, to move the given element to the given xy position","    *","    * @method _moveTo","    * @param node {Node} The node to move","    * @param x {Number} The x-position to move to","    * @param y {Number} The y-position to move to","    * @private","    */","    _moveTo : function(node, x, y) {","        if (NATIVE_TRANSITIONS) {","            node.setStyle('transform', this._transform(x, y));","        } else {","            node.setStyle(LEFT, x + PX);","            node.setStyle(TOP, y + PX);","        }","    },","","","    /**","     * Content box transition callback","     *","     * @method _onTransEnd","     * @param {Event.Facade} e The event facade","     * @private","     */","    _onTransEnd: function () {","        var sv = this;","        ","        // If for some reason we're OOB, snapback","        if (sv._isOutOfBounds()) {","            sv._snapBack();","        }","        else {","            /**","             * Notification event fired at the end of a scroll transition","             *","             * @event scrollEnd","             * @param e {EventFacade} The default event facade.","             */","            sv.fire(EV_SCROLL_END);","        }","    },","","    /**","     * gesturemovestart event handler","     *","     * @method _onGestureMoveStart","     * @param e {Event.Facade} The gesturemovestart event facade","     * @private","     */","    _onGestureMoveStart: function (e) {","","        if (this._cDisabled) {","            return false;","        }","","        var sv = this,","            bb = sv._bb,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            clientX = e.clientX,","            clientY = e.clientY;","","        if (sv._prevent.start) {","            e.preventDefault();","        }","","        // if a flick animation is in progress, cancel it","        if (sv._flickAnim) {","            sv._cancelFlick();","            sv._onTransEnd();","        }","","		if (this._cNesting){","        	e.stopPropagation();","		}","","        // Reset lastScrolledAmt","        sv.lastScrolledAmt = 0;","","        // Stores data for this gesture cycle.  Cleaned up later","        sv._gesture = {","","            // Will hold the axis value","            axis: null,","","            // The current attribute values","            startX: currentX,","            startY: currentY,","","            // The X/Y coordinates where the event began","            startClientX: clientX,","            startClientY: clientY,","","            // The X/Y coordinates where the event will end","            endClientX: null,","            endClientY: null,","","            // The current delta of the event","            deltaX: null,","            deltaY: null,","","            // Will be populated for flicks","            flick: null,","","            // Create some listeners for the rest of the gesture cycle","            onGestureMove: bb.on(DRAG + '|' + GESTURE_MOVE, Y.bind(sv._onGestureMove, sv)),","            ","            // @TODO: Don't bind gestureMoveEnd if it's a Flick?","            onGestureMoveEnd: bb.on(DRAG + '|' + GESTURE_MOVE + END, Y.bind(sv._onGestureMoveEnd, sv))","        };","    },","","    /**","     * gesturemove event handler","     *","     * @method _onGestureMove","     * @param e {Event.Facade} The gesturemove event facade","     * @private","     */","    _onGestureMove: function (e) {","        var sv = this,","            gesture = sv._gesture,","            svAxis = sv._cAxis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            startX = gesture.startX,","            startY = gesture.startY,","            startClientX = gesture.startClientX,","            startClientY = gesture.startClientY,","            clientX = e.clientX,","            clientY = e.clientY;","","        if (sv._prevent.move) {","            e.preventDefault();","        }","","        gesture.deltaX = startClientX - clientX;","        gesture.deltaY = startClientY - clientY;","","        // Determine if this is a vertical or horizontal movement","        // @TODO: This is crude, but it works.  Investigate more intelligent ways to detect intent","        if (gesture.axis === null) {","            gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;","        }","","        // Move X or Y.  @TODO: Move both if dualaxis.","        if (gesture.axis === DIM_X && svAxisX) {","            sv.set(SCROLL_X, startX + gesture.deltaX);","        }","        else if (gesture.axis === DIM_Y && svAxisY) {","            sv.set(SCROLL_Y, startY + gesture.deltaY);","        }","    },","","    /**","     * gesturemoveend event handler","     *","     * @method _onGestureMoveEnd","     * @param e {Event.Facade} The gesturemoveend event facade","     * @private","     */","    _onGestureMoveEnd: function (e) {","        var sv = this,","            gesture = sv._gesture,","            flick = gesture.flick,","            clientX = e.clientX,","            clientY = e.clientY,","            isOOB;","","        if (sv._prevent.end) {","            e.preventDefault();","        }","","        // Store the end X/Y coordinates","        gesture.endClientX = clientX;","        gesture.endClientY = clientY;","","        // Cleanup the event handlers","        gesture.onGestureMove.detach();","        gesture.onGestureMoveEnd.detach();","","        // If this wasn't a flick, wrap up the gesture cycle","        if (!flick) {","            // @TODO: Be more intelligent about this. Look at the Flick attribute to see","            // if it is safe to assume _flick did or didn't fire.","            // Then, the order _flick and _onGestureMoveEnd fire doesn't matter?","","            // If there was movement (_onGestureMove fired)","            if (gesture.deltaX !== null && gesture.deltaY !== null) {","                ","                isOOB = sv._isOutOfBounds();","                ","                // If we're out-out-bounds, then snapback","                if (isOOB) {","                    sv._snapBack();","                }","","                // Inbounds","                else {","                    // Fire scrollEnd unless this is a paginated instance and the gesture axis is the same as paginator's","                    // Not totally confident this is ideal to access a plugin's properties from a host, @TODO revisit","                    if (!sv.pages || (sv.pages && !sv.pages.get(AXIS)[gesture.axis])) {","                        sv._onTransEnd();","                    }","                }","            }","        }","    },","","    /**","     * Execute a flick at the end of a scroll action","     *","     * @method _flick","     * @param e {Event.Facade} The Flick event facade","     * @private","     */","    _flick: function (e) {","        if (this._cDisabled) {","            return false;","        }","","        var sv = this,","            svAxis = sv._cAxis,","            flick = e.flick,","            flickAxis = flick.axis,","            flickVelocity = flick.velocity,","            axisAttr = flickAxis === DIM_X ? SCROLL_X : SCROLL_Y,","            startPosition = sv.get(axisAttr);","","        // Sometimes flick is enabled, but drag is disabled","        if (sv._gesture) {","            sv._gesture.flick = flick;","        }","","        // Prevent unneccesary firing of _flickFrame if we can't scroll on the flick axis","        if (svAxis[flickAxis]) {","            sv._flickFrame(flickVelocity, flickAxis, startPosition);","        }","    },","","    /**","     * Execute a single frame in the flick animation","     *","     * @method _flickFrame","     * @param velocity {Number} The velocity of this animated frame","     * @param flickAxis {String} The axis on which to animate","     * @param startPosition {Number} The starting X/Y point to flick from","     * @protected","     */","    _flickFrame: function (velocity, flickAxis, startPosition) {","","        var sv = this,","            axisAttr = flickAxis === DIM_X ? SCROLL_X : SCROLL_Y,","            bounds = sv._getBounds(),","","            // Localize cached values","            bounce = sv._cBounce,","            bounceRange = sv._cBounceRange,","            deceleration = sv._cDeceleration,","            frameDuration = sv._cFrameDuration,","","            // Calculate","            newVelocity = velocity * deceleration,","            newPosition = startPosition - (frameDuration * newVelocity),","","            // Some convinience conditions","            min = flickAxis === DIM_X ? bounds.minScrollX : bounds.minScrollY,","            max = flickAxis === DIM_X ? bounds.maxScrollX : bounds.maxScrollY,","            belowMin       = (newPosition < min),","            belowMax       = (newPosition < max),","            aboveMin       = (newPosition > min),","            aboveMax       = (newPosition > max),","            belowMinRange  = (newPosition < (min - bounceRange)),","            withinMinRange = (belowMin && (newPosition > (min - bounceRange))),","            withinMaxRange = (aboveMax && (newPosition < (max + bounceRange))),","            aboveMaxRange  = (newPosition > (max + bounceRange)),","            tooSlow;","","        // If we're within the range but outside min/max, dampen the velocity","        if (withinMinRange || withinMaxRange) {","            newVelocity *= bounce;","        }","","        // Is the velocity too slow to bother?","        tooSlow = (Math.abs(newVelocity).toFixed(4) < 0.015);","","        // If the velocity is too slow or we're outside the range","        if (tooSlow || belowMinRange || aboveMaxRange) {","            // Cancel and delete sv._flickAnim","            if (sv._flickAnim) {","                sv._cancelFlick();","            }","","            // If we're inside the scroll area, just end","            if (aboveMin && belowMax) {","                sv._onTransEnd();","            }","","            // We're outside the scroll area, so we need to snap back","            else {","                sv._snapBack();","            }","        }","","        // Otherwise, animate to the next frame","        else {","            // @TODO: maybe use requestAnimationFrame instead","            sv._flickAnim = Y.later(frameDuration, sv, '_flickFrame', [newVelocity, flickAxis, newPosition]);","            sv.set(axisAttr, newPosition);","        }","    },","","    _cancelFlick: function () {","        var sv = this;","","        if (sv._flickAnim) {","            // Cancel the flick (if it exists)","            sv._flickAnim.cancel();","","            // Also delete it, otherwise _onGestureMoveStart will think we're still flicking","            delete sv._flickAnim;","        }","","    },","","    /**","     * Handle mousewheel events on the widget","     *","     * @method _mousewheel","     * @param e {Event.Facade} The mousewheel event facade","     * @private","     */","    _mousewheel: function (e) {","        var sv = this,","            scrollY = sv.get(SCROLL_Y),","            bounds = sv._getBounds(),","            bb = sv._bb,","            scrollOffset = 10, // 10px","            isForward = (e.wheelDelta > 0),","            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);","","        scrollToY = _constrain(scrollToY, bounds.minScrollY, bounds.maxScrollY);","","        // Because Mousewheel events fire off 'document', every ScrollView widget will react","        // to any mousewheel anywhere on the page. This check will ensure that the mouse is currently","        // over this specific ScrollView.  Also, only allow mousewheel scrolling on Y-axis,","        // becuase otherwise the 'prevent' will block page scrolling.","        if (bb.contains(e.target) && sv._cAxis[DIM_Y]) {","","            // Reset lastScrolledAmt","            sv.lastScrolledAmt = 0;","","            // Jump to the new offset","            sv.set(SCROLL_Y, scrollToY);","","            // if we have scrollbars plugin, update & set the flash timer on the scrollbar","            // @TODO: This probably shouldn't be in this module","            if (sv.scrollbars) {","                // @TODO: The scrollbars should handle this themselves","                sv.scrollbars._update();","                sv.scrollbars.flash();","                // or just this","                // sv.scrollbars._hostDimensionsChange();","            }","","            // Fire the 'scrollEnd' event","            sv._onTransEnd();","","            // prevent browser default behavior on mouse scroll","            e.preventDefault();","        }","    },","","    /**","     * Checks to see the current scrollX/scrollY position beyond the min/max boundary","     *","     * @method _isOutOfBounds","     * @param x {Number} [optional] The X position to check","     * @param y {Number} [optional] The Y position to check","     * @return {boolen} Whether the current X/Y position is out of bounds (true) or not (false)","     * @private","     */","    _isOutOfBounds: function (x, y) {","        var sv = this,","            svAxis = sv._cAxis,","            svAxisX = svAxis.x,","            svAxisY = svAxis.y,","            currentX = x || sv.get(SCROLL_X),","            currentY = y || sv.get(SCROLL_Y),","            bounds = sv._getBounds(),","            minX = bounds.minScrollX,","            minY = bounds.minScrollY,","            maxX = bounds.maxScrollX,","            maxY = bounds.maxScrollY;","","        return (svAxisX && (currentX < minX || currentX > maxX)) || (svAxisY && (currentY < minY || currentY > maxY));","    },","","    /**","     * Bounces back","     * @TODO: Should be more generalized and support both X and Y detection","     *","     * @method _snapBack","     * @private","     */","    _snapBack: function () {","        var sv = this,","            currentX = sv.get(SCROLL_X),","            currentY = sv.get(SCROLL_Y),","            bounds = sv._getBounds(),","            minX = bounds.minScrollX,","            minY = bounds.minScrollY,","            maxX = bounds.maxScrollX,","            maxY = bounds.maxScrollY,","            newY = _constrain(currentY, minY, maxY),","            newX = _constrain(currentX, minX, maxX),","            duration = sv.get(SNAP_DURATION),","            easing = sv.get(SNAP_EASING);","","        if (newX !== currentX) {","            sv.set(SCROLL_X, newX, {duration:duration, easing:easing});","        }","        else if (newY !== currentY) {","            sv.set(SCROLL_Y, newY, {duration:duration, easing:easing});","        }","        else {","            sv._onTransEnd();","        }","    },","","    /**","     * After listener for changes to the scrollX or scrollY attribute","     *","     * @method _afterScrollChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterScrollChange: function (e) {","        if (e.src === ScrollView.UI_SRC) {","            return false;","        }","","        var sv = this,","            duration = e.duration,","            easing = e.easing,","            val = e.newVal,","            scrollToArgs = [];","","        // Set the scrolled value","        sv.lastScrolledAmt = sv.lastScrolledAmt + (e.newVal - e.prevVal);","","        // Generate the array of args to pass to scrollTo()","        if (e.attrName === SCROLL_X) {","            scrollToArgs.push(val);","            scrollToArgs.push(sv.get(SCROLL_Y));","        }","        else {","            scrollToArgs.push(sv.get(SCROLL_X));","            scrollToArgs.push(val);","        }","","        scrollToArgs.push(duration);","        scrollToArgs.push(easing);","","        sv.scrollTo.apply(sv, scrollToArgs);","    },","","    /**","     * After listener for changes to the flick attribute","     *","     * @method _afterFlickChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterFlickChange: function (e) {","        this._bindFlick(e.newVal);","    },","","    /**","     * After listener for changes to the disabled attribute","     *","     * @method _afterDisabledChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDisabledChange: function (e) {","        // Cache for performance - we check during move","        this._cDisabled = e.newVal;","    },","","    /**","     * After listener for the axis attribute","     *","     * @method _afterAxisChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterAxisChange: function (e) {","        this._cAxis = e.newVal;","    },","","    /**","     * After listener for changes to the drag attribute","     *","     * @method _afterDragChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDragChange: function (e) {","        this._bindDrag(e.newVal);","    },","","    /**","     * After listener for the height or width attribute","     *","     * @method _afterDimChange","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterDimChange: function () {","        this._uiDimensionsChange();","    },","","    /**","     * After listener for scrollEnd, for cleanup","     *","     * @method _afterScrollEnd","     * @param e {Event.Facade} The event facade","     * @protected","     */","    _afterScrollEnd: function () {","        var sv = this;","","        if (sv._flickAnim) {","            sv._cancelFlick();","        }","","        // Ideally this should be removed, but doing so causing some JS errors with fast swiping","        // because _gesture is being deleted after the previous one has been overwritten","        // delete sv._gesture; // TODO: Move to sv.prevGesture?","    },","","    /**","     * Setter for 'axis' attribute","     *","     * @method _axisSetter","     * @param val {Mixed} A string ('x', 'y', 'xy') to specify which axis/axes to allow scrolling on","     * @param name {String} The attribute name","     * @return {Object} An object to specify scrollability on the x & y axes","     *","     * @protected","     */","    _axisSetter: function (val) {","","        // Turn a string into an axis object","        if (Y.Lang.isString(val)) {","            return {","                x: val.match(/x/i) ? true : false,","                y: val.match(/y/i) ? true : false","            };","        }","    },","    ","    /**","    * The scrollX, scrollY setter implementation","    *","    * @method _setScroll","    * @private","    * @param {Number} val","    * @param {String} dim","    *","    * @return {Number} The value","    */","    _setScroll : function(val) {","","        // Just ensure the widget is not disabled","        if (this._cDisabled) {","            val = Y.Attribute.INVALID_VALUE;","        }","","        return val;","    },","","    /**","    * Setter for the scrollX attribute","    *","    * @method _setScrollX","    * @param val {Number} The new scrollX value","    * @return {Number} The normalized value","    * @protected","    */","    _setScrollX: function(val) {","        return this._setScroll(val, DIM_X);","    },","","    /**","    * Setter for the scrollY ATTR","    *","    * @method _setScrollY","    * @param val {Number} The new scrollY value","    * @return {Number} The normalized value","    * @protected","    */","    _setScrollY: function(val) {","        return this._setScroll(val, DIM_Y);","    }","","    // End prototype properties","","}, {","","    // Static properties","","    /**","     * The identity of the widget.","     *","     * @property NAME","     * @type String","     * @default 'scrollview'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'scrollview',","","    /**","     * Static property used to define the default attribute configuration of","     * the Widget.","     *","     * @property ATTRS","     * @type {Object}","     * @protected","     * @static","     */","    ATTRS: {","","        /**","         * Specifies ability to scroll on x, y, or x and y axis/axes.","         *","         * @attribute axis","         * @type String","         */","        axis: {","            setter: '_axisSetter',","            writeOnce: 'initOnly'","        },","","        /**","         * The current scroll position in the x-axis","         *","         * @attribute scrollX","         * @type Number","         * @default 0","         */","        scrollX: {","            value: 0,","            setter: '_setScrollX'","        },","","        /**","         * The current scroll position in the y-axis","         *","         * @attribute scrollY","         * @type Number","         * @default 0","         */","        scrollY: {","            value: 0,","            setter: '_setScrollY'","        },","","        /**","         * Drag coefficent for inertial scrolling. The closer to 1 this","         * value is, the less friction during scrolling.","         *","         * @attribute deceleration","         * @default 0.93","         */","        deceleration: {","            value: 0.93","        },","","        /**","         * Drag coefficient for intertial scrolling at the upper","         * and lower boundaries of the scrollview. Set to 0 to","         * disable \"rubber-banding\".","         *","         * @attribute bounce","         * @type Number","         * @default 0.1","         */","        bounce: {","            value: 0.1","        },","","        /**","         * The minimum distance and/or velocity which define a flick. Can be set to false,","         * to disable flick support (note: drag support is enabled/disabled separately)","         *","         * @attribute flick","         * @type Object","         * @default Object with properties minDistance = 10, minVelocity = 0.3.","         */","        flick: {","            value: {","                minDistance: 10,","                minVelocity: 0.3","            }","        },","","        /**","         * Enable/Disable dragging the ScrollView content (note: flick support is enabled/disabled separately)","         * @attribute drag","         * @type boolean","         * @default true","         */","        drag: {","            value: true","        },","","        /**","         * The default duration to use when animating the bounce snap back.","         *","         * @attribute snapDuration","         * @type Number","         * @default 400","         */","        snapDuration: {","            value: 400","        },","","        /**","         * The default easing to use when animating the bounce snap back.","         *","         * @attribute snapEasing","         * @type String","         * @default 'ease-out'","         */","        snapEasing: {","            value: 'ease-out'","        },","","        /**","         * The default easing used when animating the flick","         *","         * @attribute easing","         * @type String","         * @default 'cubic-bezier(0, 0.1, 0, 1.0)'","         */","        easing: {","            value: 'cubic-bezier(0, 0.1, 0, 1.0)'","        },","","        /**","         * The interval (ms) used when animating the flick for JS-timer animations","         *","         * @attribute frameDuration","         * @type Number","         * @default 15","         */","        frameDuration: {","            value: 15","        },","","        /**","         * The default bounce distance in pixels","         *","         * @attribute bounceRange","         * @type Number","         * @default 150","         */","        bounceRange: {","            value: 150","        },","","        /**","         * Prevent scrollview from nesting problems","         *","         * @attribute nesting","         * @type Boolean","         * @default true","         */","        nesting: {","            value: true","        }","    },","","    /**","     * List of class names used in the scrollview's DOM","     *","     * @property CLASS_NAMES","     * @type Object","     * @static","     */","    CLASS_NAMES: CLASS_NAMES,","","    /**","     * Flag used to source property changes initiated from the DOM","     *","     * @property UI_SRC","     * @type String","     * @static","     * @default 'ui'","     */","    UI_SRC: UI,","","    /**","     * Object map of style property names used to set transition properties.","     * Defaults to the vendor prefix established by the Transition module.","     * The configured property names are `_TRANSITION.DURATION` (e.g. \"WebkitTransitionDuration\") and","     * `_TRANSITION.PROPERTY (e.g. \"WebkitTransitionProperty\").","     *","     * @property _TRANSITION","     * @private","     */","    _TRANSITION: {","        DURATION: (vendorPrefix ? vendorPrefix + 'TransitionDuration' : 'transitionDuration'),","        PROPERTY: (vendorPrefix ? vendorPrefix + 'TransitionProperty' : 'transitionProperty')","    },","","    /**","     * The default bounce distance in pixels","     *","     * @property BOUNCE_RANGE","     * @type Number","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    BOUNCE_RANGE: false,","","    /**","     * The interval (ms) used when animating the flick","     *","     * @property FRAME_STEP","     * @type Number","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    FRAME_STEP: false,","","    /**","     * The default easing used when animating the flick","     *","     * @property EASING","     * @type String","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    EASING: false,","","    /**","     * The default easing to use when animating the bounce snap back.","     *","     * @property SNAP_EASING","     * @type String","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    SNAP_EASING: false,","","    /**","     * The default duration to use when animating the bounce snap back.","     *","     * @property SNAP_DURATION","     * @type Number","     * @static","     * @default false","     * @deprecated (in 3.7.0)","     */","    SNAP_DURATION: false","","    // End static properties","","});","","}, '@VERSION@', {\"requires\": [\"widget\", \"event-gestures\", \"event-mousewheel\", \"transition\"], \"skinnable\": true});"];
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].lines = {"1":0,"11":0,"52":0,"64":0,"65":0,"68":0,"171":0,"174":0,"175":0,"178":0,"179":0,"180":0,"181":0,"182":0,"183":0,"193":0,"196":0,"197":0,"198":0,"201":0,"204":0,"205":0,"209":0,"210":0,"213":0,"214":0,"217":0,"218":0,"221":0,"222":0,"225":0,"226":0,"241":0,"246":0,"269":0,"273":0,"275":0,"276":0,"289":0,"293":0,"295":0,"296":0,"299":0,"312":0,"317":0,"320":0,"322":0,"334":0,"342":0,"345":0,"350":0,"354":0,"357":0,"360":0,"363":0,"364":0,"378":0,"391":0,"392":0,"393":0,"396":0,"397":0,"399":0,"400":0,"406":0,"408":0,"410":0,"421":0,"435":0,"436":0,"439":0,"440":0,"443":0,"463":0,"467":0,"468":0,"469":0,"470":0,"480":0,"482":0,"504":0,"505":0,"508":0,"518":0,"519":0,"520":0,"522":0,"523":0,"524":0,"527":0,"528":0,"529":0,"532":0,"534":0,"536":0,"540":0,"541":0,"542":0,"547":0,"548":0,"550":0,"551":0,"558":0,"559":0,"561":0,"562":0,"565":0,"566":0,"569":0,"584":0,"586":0,"587":0,"590":0,"603":0,"604":0,"606":0,"607":0,"620":0,"623":0,"624":0,"633":0,"646":0,"647":0,"650":0,"657":0,"658":0,"662":0,"663":0,"664":0,"667":0,"668":0,"672":0,"675":0,"715":0,"727":0,"728":0,"731":0,"732":0,"736":0,"737":0,"741":0,"742":0,"744":0,"745":0,"757":0,"764":0,"765":0,"769":0,"770":0,"773":0,"774":0,"777":0,"783":0,"785":0,"788":0,"789":0,"796":0,"797":0,"812":0,"813":0,"816":0,"825":0,"826":0,"830":0,"831":0,"846":0,"874":0,"875":0,"879":0,"882":0,"884":0,"885":0,"889":0,"890":0,"895":0,"902":0,"903":0,"908":0,"910":0,"912":0,"915":0,"928":0,"936":0,"942":0,"945":0,"948":0,"952":0,"954":0,"955":0,"961":0,"964":0,"978":0,"990":0,"1001":0,"1014":0,"1015":0,"1017":0,"1018":0,"1021":0,"1033":0,"1034":0,"1037":0,"1044":0,"1047":0,"1048":0,"1049":0,"1052":0,"1053":0,"1056":0,"1057":0,"1059":0,"1070":0,"1082":0,"1093":0,"1104":0,"1115":0,"1126":0,"1128":0,"1129":0,"1150":0,"1151":0,"1171":0,"1172":0,"1175":0,"1187":0,"1199":0};
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].functions = {"_constrain:51":0,"ScrollView:64":0,"initializer:170":0,"bindUI:192":0,"_bindAttrs:240":0,"_bindDrag:268":0,"_bindFlick:288":0,"_bindMousewheel:311":0,"syncUI:333":0,"_getScrollDims:377":0,"_uiDimensionsChange:420":0,"_setBounds:462":0,"_getBounds:479":0,"scrollTo:502":0,"_transform:582":0,"_moveTo:602":0,"_onTransEnd:619":0,"_onGestureMoveStart:644":0,"_onGestureMove:714":0,"_onGestureMoveEnd:756":0,"_flick:811":0,"_flickFrame:844":0,"_cancelFlick:907":0,"_mousewheel:927":0,"_isOutOfBounds:977":0,"_snapBack:1000":0,"_afterScrollChange:1032":0,"_afterFlickChange:1069":0,"_afterDisabledChange:1080":0,"_afterAxisChange:1092":0,"_afterDragChange:1103":0,"_afterDimChange:1114":0,"_afterScrollEnd:1125":0,"_axisSetter:1147":0,"_setScroll:1168":0,"_setScrollX:1186":0,"_setScrollY:1198":0,"(anonymous 1):1":0};
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].coveredLines = 226;
_yuitest_coverage["build/scrollview-base/scrollview-base.js"].coveredFunctions = 38;
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1);
YUI.add('scrollview-base', function (Y, NAME) {

/**
 * The scrollview-base module provides a basic ScrollView Widget, without scrollbar indicators
 *
 * @module scrollview
 * @submodule scrollview-base
 */

 // Local vars
_yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 11);
var getClassName = Y.ClassNameManager.getClassName,
    DOCUMENT = Y.config.doc,
    IE = Y.UA.ie,
    NATIVE_TRANSITIONS = Y.Transition.useNative,
    vendorPrefix = Y.Transition._VENDOR_PREFIX, // Todo: This is a private property, and alternative approaches should be investigated
    SCROLLVIEW = 'scrollview',
    CLASS_NAMES = {
        vertical: getClassName(SCROLLVIEW, 'vert'),
        horizontal: getClassName(SCROLLVIEW, 'horiz')
    },
    EV_SCROLL_END = 'scrollEnd',
    FLICK = 'flick',
    DRAG = 'drag',
    MOUSEWHEEL = 'mousewheel',
    UI = 'ui',
    TOP = 'top',
    LEFT = 'left',
    PX = 'px',
    AXIS = 'axis',
    SCROLL_Y = 'scrollY',
    SCROLL_X = 'scrollX',
    BOUNCE = 'bounce',
    DISABLED = 'disabled',
    DECELERATION = 'deceleration',
    DIM_X = 'x',
    DIM_Y = 'y',
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX = 'contentBox',
    GESTURE_MOVE = 'gesturemove',
    START = 'start',
    END = 'end',
    EMPTY = '',
    ZERO = '0s',
    SNAP_DURATION = 'snapDuration',
    SNAP_EASING = 'snapEasing',
    EASING = 'easing',
    FRAME_DURATION = 'frameDuration',
    BOUNCE_RANGE = 'bounceRange',
    NESTING = 'nesting',

    _constrain = function (val, min, max) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_constrain", 51);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 52);
return Math.min(Math.max(val, min), max);
    };

/**
 * ScrollView provides a scrollable widget, supporting flick gestures,
 * across both touch and mouse based devices.
 *
 * @class ScrollView
 * @param config {Object} Object literal with initial attribute values
 * @extends Widget
 * @constructor
 */
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 64);
function ScrollView() {
    _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "ScrollView", 64);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 65);
ScrollView.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/scrollview-base/scrollview-base.js", 68);
Y.ScrollView = Y.extend(ScrollView, Y.Widget, {

    // *** Y.ScrollView prototype

    /**
     * Flag driving whether or not we should try and force H/W acceleration when transforming. Currently enabled by default for Webkit.
     * Used by the _transform method.
     *
     * @property _forceHWTransforms
     * @type boolean
     * @protected
     */
    _forceHWTransforms: Y.UA.webkit ? true : false,

    /**
     * <p>Used to control whether or not ScrollView's internal
     * gesturemovestart, gesturemove and gesturemoveend
     * event listeners should preventDefault. The value is an
     * object, with "start", "move" and "end" properties used to
     * specify which events should preventDefault and which shouldn't:</p>
     *
     * <pre>
     * {
     *    start: false,
     *    move: true,
     *    end: false
     * }
     * </pre>
     *
     * <p>The default values are set up in order to prevent panning,
     * on touch devices, while allowing click listeners on elements inside
     * the ScrollView to be notified as expected.</p>
     *
     * @property _prevent
     * @type Object
     * @protected
     */
    _prevent: {
        start: false,
        move: true,
        end: false
    },

    /**
     * Contains the distance (postive or negative) in pixels by which
     *  the scrollview was last scrolled. This is useful when setting up
     *  click listeners on the scrollview content, which on mouse based
     *  devices are always fired, even after a drag/flick.
     *
     * <p>Touch based devices don't currently fire a click event,
     *  if the finger has been moved (beyond a threshold) so this
     *  check isn't required, if working in a purely touch based environment</p>
     *
     * @property lastScrolledAmt
     * @type Number
     * @public
     * @default 0
     */
    lastScrolledAmt: 0,

    /**
     * Internal state, defines the minimum amount that the scrollview can be scrolled along the X axis
     *
     * @property _minScrollX
     * @type number
     * @protected
     */
    _minScrollX: null,

    /**
     * Internal state, defines the maximum amount that the scrollview can be scrolled along the X axis
     *
     * @property _maxScrollX
     * @type number
     * @protected
     */
    _maxScrollX: null,

    /**
     * Internal state, defines the minimum amount that the scrollview can be scrolled along the Y axis
     *
     * @property _minScrollY
     * @type number
     * @protected
     */
    _minScrollY: null,

    /**
     * Internal state, defines the maximum amount that the scrollview can be scrolled along the Y axis
     *
     * @property _maxScrollY
     * @type number
     * @protected
     */
    _maxScrollY: null,
    
    /**
     * Designated initializer
     *
     * @method initializer
     * @param {config} Configuration object for the plugin
     */
    initializer: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "initializer", 170);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 171);
var sv = this;

        // Cache these values, since they aren't going to change.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 174);
sv._bb = sv.get(BOUNDING_BOX);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 175);
sv._cb = sv.get(CONTENT_BOX);

        // Cache some attributes
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 178);
sv._cAxis = sv.get(AXIS);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 179);
sv._cBounce = sv.get(BOUNCE);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 180);
sv._cBounceRange = sv.get(BOUNCE_RANGE);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 181);
sv._cDeceleration = sv.get(DECELERATION);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 182);
sv._cFrameDuration = sv.get(FRAME_DURATION);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 183);
sv._cNesting = sv.get(NESTING);
    },

    /**
     * bindUI implementation
     *
     * Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "bindUI", 192);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 193);
var sv = this;

        // Bind interaction listers
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 196);
sv._bindFlick(sv.get(FLICK));
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 197);
sv._bindDrag(sv.get(DRAG));
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 198);
sv._bindMousewheel(true);
        
        // Bind change events
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 201);
sv._bindAttrs();

        // IE SELECT HACK. See if we can do this non-natively and in the gesture for a future release.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 204);
if (IE) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 205);
sv._fixIESelect(sv._bb, sv._cb);
        }

        // Set any deprecated static properties
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 209);
if (ScrollView.SNAP_DURATION) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 210);
sv.set(SNAP_DURATION, ScrollView.SNAP_DURATION);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 213);
if (ScrollView.SNAP_EASING) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 214);
sv.set(SNAP_EASING, ScrollView.SNAP_EASING);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 217);
if (ScrollView.EASING) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 218);
sv.set(EASING, ScrollView.EASING);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 221);
if (ScrollView.FRAME_STEP) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 222);
sv.set(FRAME_DURATION, ScrollView.FRAME_STEP);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 225);
if (ScrollView.BOUNCE_RANGE) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 226);
sv.set(BOUNCE_RANGE, ScrollView.BOUNCE_RANGE);
        }

        // Recalculate dimension properties
        // TODO: This should be throttled.
        // Y.one(WINDOW).after('resize', sv._afterDimChange, sv);
    },

    /**
     * Bind event listeners
     *
     * @method _bindAttrs
     * @private
     */
    _bindAttrs: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindAttrs", 240);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 241);
var sv = this,
            scrollChangeHandler = sv._afterScrollChange,
            dimChangeHandler = sv._afterDimChange;

        // Bind any change event listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 246);
sv.after({
            'scrollEnd': sv._afterScrollEnd,
            'disabledChange': sv._afterDisabledChange,
            'flickChange': sv._afterFlickChange,
            'dragChange': sv._afterDragChange,
            'axisChange': sv._afterAxisChange,
            'scrollYChange': scrollChangeHandler,
            'scrollXChange': scrollChangeHandler,
            'heightChange': dimChangeHandler,
            'widthChange': dimChangeHandler
        });
    },

    /**
     * Bind (or unbind) gesture move listeners required for drag support
     *
     * @method _bindDrag
     * @param drag {boolean} If true, the method binds listener to enable
     *  drag (gesturemovestart). If false, the method unbinds gesturemove
     *  listeners for drag support.
     * @private
     */
    _bindDrag: function (drag) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindDrag", 268);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 269);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'drag' listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 273);
bb.detach(DRAG + '|*');

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 275);
if (drag) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 276);
bb.on(DRAG + '|' + GESTURE_MOVE + START, Y.bind(sv._onGestureMoveStart, sv));
        }
    },

    /**
     * Bind (or unbind) flick listeners.
     *
     * @method _bindFlick
     * @param flick {Object|boolean} If truthy, the method binds listeners for
     *  flick support. If false, the method unbinds flick listeners.
     * @private
     */
    _bindFlick: function (flick) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindFlick", 288);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 289);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'flick' listeners
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 293);
bb.detach(FLICK + '|*');

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 295);
if (flick) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 296);
bb.on(FLICK + '|' + FLICK, Y.bind(sv._flick, sv), flick);

            // Rebind Drag, becuase _onGestureMoveEnd always has to fire -after- _flick
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 299);
sv._bindDrag(sv.get(DRAG));
        }
    },

    /**
     * Bind (or unbind) mousewheel listeners.
     *
     * @method _bindMousewheel
     * @param mousewheel {Object|boolean} If truthy, the method binds listeners for
     *  mousewheel support. If false, the method unbinds mousewheel listeners.
     * @private
     */
    _bindMousewheel: function (mousewheel) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_bindMousewheel", 311);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 312);
var sv = this,
            bb = sv._bb;

        // Unbind any previous 'mousewheel' listeners
        // TODO: This doesn't actually appear to work properly. Fix. #2532743
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 317);
bb.detach(MOUSEWHEEL + '|*');

        // Only enable for vertical scrollviews
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 320);
if (mousewheel) {
            // Bound to document, because that's where mousewheel events fire off of.
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 322);
Y.one(DOCUMENT).on(MOUSEWHEEL, Y.bind(sv._mousewheel, sv));
        }
    },

    /**
     * syncUI implementation.
     *
     * Update the scroll position, based on the current value of scrollX/scrollY.
     *
     * @method syncUI
     */
    syncUI: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "syncUI", 333);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 334);
var sv = this,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight;

        // If the axis is undefined, auto-calculate it
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 342);
if (sv._cAxis === undefined) {
            // This should only ever be run once (for now).
            // In the future SV might post-load axis changes
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 345);
sv._cAxis = {
                x: (scrollWidth > width),
                y: (scrollHeight > height)
            };

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 350);
sv._set(AXIS, sv._cAxis);
        }
        
        // get text direction on or inherited by scrollview node
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 354);
sv.rtl = (sv._cb.getComputedStyle('direction') === 'rtl');

        // Cache the disabled value
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 357);
sv._cDisabled = sv.get(DISABLED);

        // Run this to set initial values
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 360);
sv._uiDimensionsChange();

        // If we're out-of-bounds, snap back.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 363);
if (sv._isOutOfBounds()) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 364);
sv._snapBack();
        }
    },

    /**
     * Utility method to obtain widget dimensions
     *
     * @method _getScrollDims
     * @return {Object} The offsetWidth, offsetHeight, scrollWidth and
     *  scrollHeight as an array: [offsetWidth, offsetHeight, scrollWidth,
     *  scrollHeight]
     * @private
     */
    _getScrollDims: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_getScrollDims", 377);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 378);
var sv = this,
            cb = sv._cb,
            bb = sv._bb,
            TRANS = ScrollView._TRANSITION,
            // Ideally using CSSMatrix - don't think we have it normalized yet though.
            // origX = (new WebKitCSSMatrix(cb.getComputedStyle("transform"))).e,
            // origY = (new WebKitCSSMatrix(cb.getComputedStyle("transform"))).f,
            origX = sv.get(SCROLL_X),
            origY = sv.get(SCROLL_Y),
            origHWTransform,
            dims;

        // TODO: Is this OK? Just in case it's called 'during' a transition.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 391);
if (NATIVE_TRANSITIONS) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 392);
cb.setStyle(TRANS.DURATION, ZERO);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 393);
cb.setStyle(TRANS.PROPERTY, EMPTY);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 396);
origHWTransform = sv._forceHWTransforms;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 397);
sv._forceHWTransforms = false; // the z translation was causing issues with picking up accurate scrollWidths in Chrome/Mac.

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 399);
sv._moveTo(cb, 0, 0);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 400);
dims = {
            'offsetWidth': bb.get('offsetWidth'),
            'offsetHeight': bb.get('offsetHeight'),
            'scrollWidth': bb.get('scrollWidth'),
            'scrollHeight': bb.get('scrollHeight')
        };
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 406);
sv._moveTo(cb, -(origX), -(origY));

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 408);
sv._forceHWTransforms = origHWTransform;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 410);
return dims;
    },

    /**
     * This method gets invoked whenever the height or width attributes change,
     * allowing us to determine which scrolling axes need to be enabled.
     *
     * @method _uiDimensionsChange
     * @protected
     */
    _uiDimensionsChange: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_uiDimensionsChange", 420);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 421);
var sv = this,
            bb = sv._bb,
            scrollDims = sv._getScrollDims(),
            width = scrollDims.offsetWidth,
            height = scrollDims.offsetHeight,
            scrollWidth = scrollDims.scrollWidth,
            scrollHeight = scrollDims.scrollHeight,
            rtl = sv.rtl,
            svAxis = sv._cAxis,
            minScrollX = (rtl ? Math.min(0, -(scrollWidth - width)) : 0),
            maxScrollX = (rtl ? 0 : Math.max(0, scrollWidth - width)),
            minScrollY = 0,
            maxScrollY = Math.max(0, scrollHeight - height);
            
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 435);
if (svAxis && svAxis.x) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 436);
bb.addClass(CLASS_NAMES.horizontal);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 439);
if (svAxis && svAxis.y) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 440);
bb.addClass(CLASS_NAMES.vertical);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 443);
sv._setBounds({
            minScrollX: minScrollX,
            maxScrollX: maxScrollX,
            minScrollY: minScrollY,
            maxScrollY: maxScrollY
        });
    },

    /**
     * Set the bounding dimensions of the ScrollView
     *
     * @method _setBounds
     * @protected
     * @param bounds {Object} [duration] ms of the scroll animation. (default is 0)
     *   @param {Number} [bounds.minScrollX] The minimum scroll X value
     *   @param {Number} [bounds.maxScrollX] The maximum scroll X value
     *   @param {Number} [bounds.minScrollY] The minimum scroll Y value
     *   @param {Number} [bounds.maxScrollY] The maximum scroll Y value
     */
    _setBounds: function (bounds) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_setBounds", 462);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 463);
var sv = this;
        
        // TODO: Do a check to log if the bounds are invalid

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 467);
sv._minScrollX = bounds.minScrollX;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 468);
sv._maxScrollX = bounds.maxScrollX;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 469);
sv._minScrollY = bounds.minScrollY;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 470);
sv._maxScrollY = bounds.maxScrollY;
    },

    /**
     * Get the bounding dimensions of the ScrollView
     *
     * @method _getBounds
     * @protected
     */
    _getBounds: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_getBounds", 479);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 480);
var sv = this;
        
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 482);
return {
            minScrollX: sv._minScrollX,
            maxScrollX: sv._maxScrollX,
            minScrollY: sv._minScrollY,
            maxScrollY: sv._maxScrollY
        };

    },

    /**
     * Scroll the element to a given xy coordinate
     *
     * @method scrollTo
     * @param x {Number} The x-position to scroll to. (null for no movement)
     * @param y {Number} The y-position to scroll to. (null for no movement)
     * @param {Number} [duration] ms of the scroll animation. (default is 0)
     * @param {String} [easing] An easing equation if duration is set. (default is `easing` attribute)
     * @param {String} [node] The node to transform.  Setting this can be useful in
     *  dual-axis paginated instances. (default is the instance's contentBox)
     */
    scrollTo: function (x, y, duration, easing, node) {
        // Check to see if widget is disabled
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "scrollTo", 502);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 504);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 505);
return;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 508);
var sv = this,
            cb = sv._cb,
            TRANS = ScrollView._TRANSITION,
            callback = Y.bind(sv._onTransEnd, sv), // @Todo : cache this
            newX = 0,
            newY = 0,
            transition = {},
            transform;

        // default the optional arguments
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 518);
duration = duration || 0;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 519);
easing = easing || sv.get(EASING); // @TODO: Cache this
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 520);
node = node || cb;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 522);
if (x !== null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 523);
sv.set(SCROLL_X, x, {src:UI});
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 524);
newX = -(x);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 527);
if (y !== null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 528);
sv.set(SCROLL_Y, y, {src:UI});
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 529);
newY = -(y);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 532);
transform = sv._transform(newX, newY);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 534);
if (NATIVE_TRANSITIONS) {
            // ANDROID WORKAROUND - try and stop existing transition, before kicking off new one.
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 536);
node.setStyle(TRANS.DURATION, ZERO).setStyle(TRANS.PROPERTY, EMPTY);
        }

        // Move
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 540);
if (duration === 0) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 541);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 542);
node.setStyle('transform', transform);
            }
            else {
                // TODO: If both set, batch them in the same update
                // Update: Nope, setStyles() just loops through each property and applies it.
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 547);
if (x !== null) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 548);
node.setStyle(LEFT, newX + PX);
                }
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 550);
if (y !== null) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 551);
node.setStyle(TOP, newY + PX);
                }
            }
        }

        // Animate
        else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 558);
transition.easing = easing;
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 559);
transition.duration = duration / 1000;

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 561);
if (NATIVE_TRANSITIONS) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 562);
transition.transform = transform;
            }
            else {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 565);
transition.left = newX + PX;
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 566);
transition.top = newY + PX;
            }

            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 569);
node.transition(transition, callback);
        }
    },

    /**
     * Utility method, to create the translate transform string with the
     * x, y translation amounts provided.
     *
     * @method _transform
     * @param {Number} x Number of pixels to translate along the x axis
     * @param {Number} y Number of pixels to translate along the y axis
     * @private
     */
    _transform: function (x, y) {
        // TODO: Would we be better off using a Matrix for this?
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_transform", 582);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 584);
var prop = 'translate(' + x + 'px, ' + y + 'px)';

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 586);
if (this._forceHWTransforms) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 587);
prop += ' translateZ(0)';
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 590);
return prop;
    },

    /**
    * Utility method, to move the given element to the given xy position
    *
    * @method _moveTo
    * @param node {Node} The node to move
    * @param x {Number} The x-position to move to
    * @param y {Number} The y-position to move to
    * @private
    */
    _moveTo : function(node, x, y) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_moveTo", 602);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 603);
if (NATIVE_TRANSITIONS) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 604);
node.setStyle('transform', this._transform(x, y));
        } else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 606);
node.setStyle(LEFT, x + PX);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 607);
node.setStyle(TOP, y + PX);
        }
    },


    /**
     * Content box transition callback
     *
     * @method _onTransEnd
     * @param {Event.Facade} e The event facade
     * @private
     */
    _onTransEnd: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onTransEnd", 619);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 620);
var sv = this;
        
        // If for some reason we're OOB, snapback
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 623);
if (sv._isOutOfBounds()) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 624);
sv._snapBack();
        }
        else {
            /**
             * Notification event fired at the end of a scroll transition
             *
             * @event scrollEnd
             * @param e {EventFacade} The default event facade.
             */
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 633);
sv.fire(EV_SCROLL_END);
        }
    },

    /**
     * gesturemovestart event handler
     *
     * @method _onGestureMoveStart
     * @param e {Event.Facade} The gesturemovestart event facade
     * @private
     */
    _onGestureMoveStart: function (e) {

        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMoveStart", 644);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 646);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 647);
return false;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 650);
var sv = this,
            bb = sv._bb,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            clientX = e.clientX,
            clientY = e.clientY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 657);
if (sv._prevent.start) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 658);
e.preventDefault();
        }

        // if a flick animation is in progress, cancel it
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 662);
if (sv._flickAnim) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 663);
sv._cancelFlick();
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 664);
sv._onTransEnd();
        }

		_yuitest_coverline("build/scrollview-base/scrollview-base.js", 667);
if (this._cNesting){
        	_yuitest_coverline("build/scrollview-base/scrollview-base.js", 668);
e.stopPropagation();
		}

        // Reset lastScrolledAmt
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 672);
sv.lastScrolledAmt = 0;

        // Stores data for this gesture cycle.  Cleaned up later
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 675);
sv._gesture = {

            // Will hold the axis value
            axis: null,

            // The current attribute values
            startX: currentX,
            startY: currentY,

            // The X/Y coordinates where the event began
            startClientX: clientX,
            startClientY: clientY,

            // The X/Y coordinates where the event will end
            endClientX: null,
            endClientY: null,

            // The current delta of the event
            deltaX: null,
            deltaY: null,

            // Will be populated for flicks
            flick: null,

            // Create some listeners for the rest of the gesture cycle
            onGestureMove: bb.on(DRAG + '|' + GESTURE_MOVE, Y.bind(sv._onGestureMove, sv)),
            
            // @TODO: Don't bind gestureMoveEnd if it's a Flick?
            onGestureMoveEnd: bb.on(DRAG + '|' + GESTURE_MOVE + END, Y.bind(sv._onGestureMoveEnd, sv))
        };
    },

    /**
     * gesturemove event handler
     *
     * @method _onGestureMove
     * @param e {Event.Facade} The gesturemove event facade
     * @private
     */
    _onGestureMove: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMove", 714);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 715);
var sv = this,
            gesture = sv._gesture,
            svAxis = sv._cAxis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            startX = gesture.startX,
            startY = gesture.startY,
            startClientX = gesture.startClientX,
            startClientY = gesture.startClientY,
            clientX = e.clientX,
            clientY = e.clientY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 727);
if (sv._prevent.move) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 728);
e.preventDefault();
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 731);
gesture.deltaX = startClientX - clientX;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 732);
gesture.deltaY = startClientY - clientY;

        // Determine if this is a vertical or horizontal movement
        // @TODO: This is crude, but it works.  Investigate more intelligent ways to detect intent
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 736);
if (gesture.axis === null) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 737);
gesture.axis = (Math.abs(gesture.deltaX) > Math.abs(gesture.deltaY)) ? DIM_X : DIM_Y;
        }

        // Move X or Y.  @TODO: Move both if dualaxis.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 741);
if (gesture.axis === DIM_X && svAxisX) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 742);
sv.set(SCROLL_X, startX + gesture.deltaX);
        }
        else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 744);
if (gesture.axis === DIM_Y && svAxisY) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 745);
sv.set(SCROLL_Y, startY + gesture.deltaY);
        }}
    },

    /**
     * gesturemoveend event handler
     *
     * @method _onGestureMoveEnd
     * @param e {Event.Facade} The gesturemoveend event facade
     * @private
     */
    _onGestureMoveEnd: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_onGestureMoveEnd", 756);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 757);
var sv = this,
            gesture = sv._gesture,
            flick = gesture.flick,
            clientX = e.clientX,
            clientY = e.clientY,
            isOOB;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 764);
if (sv._prevent.end) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 765);
e.preventDefault();
        }

        // Store the end X/Y coordinates
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 769);
gesture.endClientX = clientX;
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 770);
gesture.endClientY = clientY;

        // Cleanup the event handlers
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 773);
gesture.onGestureMove.detach();
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 774);
gesture.onGestureMoveEnd.detach();

        // If this wasn't a flick, wrap up the gesture cycle
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 777);
if (!flick) {
            // @TODO: Be more intelligent about this. Look at the Flick attribute to see
            // if it is safe to assume _flick did or didn't fire.
            // Then, the order _flick and _onGestureMoveEnd fire doesn't matter?

            // If there was movement (_onGestureMove fired)
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 783);
if (gesture.deltaX !== null && gesture.deltaY !== null) {
                
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 785);
isOOB = sv._isOutOfBounds();
                
                // If we're out-out-bounds, then snapback
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 788);
if (isOOB) {
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 789);
sv._snapBack();
                }

                // Inbounds
                else {
                    // Fire scrollEnd unless this is a paginated instance and the gesture axis is the same as paginator's
                    // Not totally confident this is ideal to access a plugin's properties from a host, @TODO revisit
                    _yuitest_coverline("build/scrollview-base/scrollview-base.js", 796);
if (!sv.pages || (sv.pages && !sv.pages.get(AXIS)[gesture.axis])) {
                        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 797);
sv._onTransEnd();
                    }
                }
            }
        }
    },

    /**
     * Execute a flick at the end of a scroll action
     *
     * @method _flick
     * @param e {Event.Facade} The Flick event facade
     * @private
     */
    _flick: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_flick", 811);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 812);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 813);
return false;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 816);
var sv = this,
            svAxis = sv._cAxis,
            flick = e.flick,
            flickAxis = flick.axis,
            flickVelocity = flick.velocity,
            axisAttr = flickAxis === DIM_X ? SCROLL_X : SCROLL_Y,
            startPosition = sv.get(axisAttr);

        // Sometimes flick is enabled, but drag is disabled
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 825);
if (sv._gesture) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 826);
sv._gesture.flick = flick;
        }

        // Prevent unneccesary firing of _flickFrame if we can't scroll on the flick axis
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 830);
if (svAxis[flickAxis]) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 831);
sv._flickFrame(flickVelocity, flickAxis, startPosition);
        }
    },

    /**
     * Execute a single frame in the flick animation
     *
     * @method _flickFrame
     * @param velocity {Number} The velocity of this animated frame
     * @param flickAxis {String} The axis on which to animate
     * @param startPosition {Number} The starting X/Y point to flick from
     * @protected
     */
    _flickFrame: function (velocity, flickAxis, startPosition) {

        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_flickFrame", 844);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 846);
var sv = this,
            axisAttr = flickAxis === DIM_X ? SCROLL_X : SCROLL_Y,
            bounds = sv._getBounds(),

            // Localize cached values
            bounce = sv._cBounce,
            bounceRange = sv._cBounceRange,
            deceleration = sv._cDeceleration,
            frameDuration = sv._cFrameDuration,

            // Calculate
            newVelocity = velocity * deceleration,
            newPosition = startPosition - (frameDuration * newVelocity),

            // Some convinience conditions
            min = flickAxis === DIM_X ? bounds.minScrollX : bounds.minScrollY,
            max = flickAxis === DIM_X ? bounds.maxScrollX : bounds.maxScrollY,
            belowMin       = (newPosition < min),
            belowMax       = (newPosition < max),
            aboveMin       = (newPosition > min),
            aboveMax       = (newPosition > max),
            belowMinRange  = (newPosition < (min - bounceRange)),
            withinMinRange = (belowMin && (newPosition > (min - bounceRange))),
            withinMaxRange = (aboveMax && (newPosition < (max + bounceRange))),
            aboveMaxRange  = (newPosition > (max + bounceRange)),
            tooSlow;

        // If we're within the range but outside min/max, dampen the velocity
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 874);
if (withinMinRange || withinMaxRange) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 875);
newVelocity *= bounce;
        }

        // Is the velocity too slow to bother?
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 879);
tooSlow = (Math.abs(newVelocity).toFixed(4) < 0.015);

        // If the velocity is too slow or we're outside the range
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 882);
if (tooSlow || belowMinRange || aboveMaxRange) {
            // Cancel and delete sv._flickAnim
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 884);
if (sv._flickAnim) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 885);
sv._cancelFlick();
            }

            // If we're inside the scroll area, just end
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 889);
if (aboveMin && belowMax) {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 890);
sv._onTransEnd();
            }

            // We're outside the scroll area, so we need to snap back
            else {
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 895);
sv._snapBack();
            }
        }

        // Otherwise, animate to the next frame
        else {
            // @TODO: maybe use requestAnimationFrame instead
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 902);
sv._flickAnim = Y.later(frameDuration, sv, '_flickFrame', [newVelocity, flickAxis, newPosition]);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 903);
sv.set(axisAttr, newPosition);
        }
    },

    _cancelFlick: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_cancelFlick", 907);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 908);
var sv = this;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 910);
if (sv._flickAnim) {
            // Cancel the flick (if it exists)
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 912);
sv._flickAnim.cancel();

            // Also delete it, otherwise _onGestureMoveStart will think we're still flicking
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 915);
delete sv._flickAnim;
        }

    },

    /**
     * Handle mousewheel events on the widget
     *
     * @method _mousewheel
     * @param e {Event.Facade} The mousewheel event facade
     * @private
     */
    _mousewheel: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_mousewheel", 927);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 928);
var sv = this,
            scrollY = sv.get(SCROLL_Y),
            bounds = sv._getBounds(),
            bb = sv._bb,
            scrollOffset = 10, // 10px
            isForward = (e.wheelDelta > 0),
            scrollToY = scrollY - ((isForward ? 1 : -1) * scrollOffset);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 936);
scrollToY = _constrain(scrollToY, bounds.minScrollY, bounds.maxScrollY);

        // Because Mousewheel events fire off 'document', every ScrollView widget will react
        // to any mousewheel anywhere on the page. This check will ensure that the mouse is currently
        // over this specific ScrollView.  Also, only allow mousewheel scrolling on Y-axis,
        // becuase otherwise the 'prevent' will block page scrolling.
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 942);
if (bb.contains(e.target) && sv._cAxis[DIM_Y]) {

            // Reset lastScrolledAmt
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 945);
sv.lastScrolledAmt = 0;

            // Jump to the new offset
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 948);
sv.set(SCROLL_Y, scrollToY);

            // if we have scrollbars plugin, update & set the flash timer on the scrollbar
            // @TODO: This probably shouldn't be in this module
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 952);
if (sv.scrollbars) {
                // @TODO: The scrollbars should handle this themselves
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 954);
sv.scrollbars._update();
                _yuitest_coverline("build/scrollview-base/scrollview-base.js", 955);
sv.scrollbars.flash();
                // or just this
                // sv.scrollbars._hostDimensionsChange();
            }

            // Fire the 'scrollEnd' event
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 961);
sv._onTransEnd();

            // prevent browser default behavior on mouse scroll
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 964);
e.preventDefault();
        }
    },

    /**
     * Checks to see the current scrollX/scrollY position beyond the min/max boundary
     *
     * @method _isOutOfBounds
     * @param x {Number} [optional] The X position to check
     * @param y {Number} [optional] The Y position to check
     * @return {boolen} Whether the current X/Y position is out of bounds (true) or not (false)
     * @private
     */
    _isOutOfBounds: function (x, y) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_isOutOfBounds", 977);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 978);
var sv = this,
            svAxis = sv._cAxis,
            svAxisX = svAxis.x,
            svAxisY = svAxis.y,
            currentX = x || sv.get(SCROLL_X),
            currentY = y || sv.get(SCROLL_Y),
            bounds = sv._getBounds(),
            minX = bounds.minScrollX,
            minY = bounds.minScrollY,
            maxX = bounds.maxScrollX,
            maxY = bounds.maxScrollY;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 990);
return (svAxisX && (currentX < minX || currentX > maxX)) || (svAxisY && (currentY < minY || currentY > maxY));
    },

    /**
     * Bounces back
     * @TODO: Should be more generalized and support both X and Y detection
     *
     * @method _snapBack
     * @private
     */
    _snapBack: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_snapBack", 1000);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1001);
var sv = this,
            currentX = sv.get(SCROLL_X),
            currentY = sv.get(SCROLL_Y),
            bounds = sv._getBounds(),
            minX = bounds.minScrollX,
            minY = bounds.minScrollY,
            maxX = bounds.maxScrollX,
            maxY = bounds.maxScrollY,
            newY = _constrain(currentY, minY, maxY),
            newX = _constrain(currentX, minX, maxX),
            duration = sv.get(SNAP_DURATION),
            easing = sv.get(SNAP_EASING);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1014);
if (newX !== currentX) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1015);
sv.set(SCROLL_X, newX, {duration:duration, easing:easing});
        }
        else {_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1017);
if (newY !== currentY) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1018);
sv.set(SCROLL_Y, newY, {duration:duration, easing:easing});
        }
        else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1021);
sv._onTransEnd();
        }}
    },

    /**
     * After listener for changes to the scrollX or scrollY attribute
     *
     * @method _afterScrollChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterScrollChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterScrollChange", 1032);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1033);
if (e.src === ScrollView.UI_SRC) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1034);
return false;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1037);
var sv = this,
            duration = e.duration,
            easing = e.easing,
            val = e.newVal,
            scrollToArgs = [];

        // Set the scrolled value
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1044);
sv.lastScrolledAmt = sv.lastScrolledAmt + (e.newVal - e.prevVal);

        // Generate the array of args to pass to scrollTo()
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1047);
if (e.attrName === SCROLL_X) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1048);
scrollToArgs.push(val);
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1049);
scrollToArgs.push(sv.get(SCROLL_Y));
        }
        else {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1052);
scrollToArgs.push(sv.get(SCROLL_X));
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1053);
scrollToArgs.push(val);
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1056);
scrollToArgs.push(duration);
        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1057);
scrollToArgs.push(easing);

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1059);
sv.scrollTo.apply(sv, scrollToArgs);
    },

    /**
     * After listener for changes to the flick attribute
     *
     * @method _afterFlickChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterFlickChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterFlickChange", 1069);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1070);
this._bindFlick(e.newVal);
    },

    /**
     * After listener for changes to the disabled attribute
     *
     * @method _afterDisabledChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDisabledChange: function (e) {
        // Cache for performance - we check during move
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDisabledChange", 1080);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1082);
this._cDisabled = e.newVal;
    },

    /**
     * After listener for the axis attribute
     *
     * @method _afterAxisChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterAxisChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterAxisChange", 1092);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1093);
this._cAxis = e.newVal;
    },

    /**
     * After listener for changes to the drag attribute
     *
     * @method _afterDragChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDragChange: function (e) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDragChange", 1103);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1104);
this._bindDrag(e.newVal);
    },

    /**
     * After listener for the height or width attribute
     *
     * @method _afterDimChange
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterDimChange: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterDimChange", 1114);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1115);
this._uiDimensionsChange();
    },

    /**
     * After listener for scrollEnd, for cleanup
     *
     * @method _afterScrollEnd
     * @param e {Event.Facade} The event facade
     * @protected
     */
    _afterScrollEnd: function () {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_afterScrollEnd", 1125);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1126);
var sv = this;

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1128);
if (sv._flickAnim) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1129);
sv._cancelFlick();
        }

        // Ideally this should be removed, but doing so causing some JS errors with fast swiping
        // because _gesture is being deleted after the previous one has been overwritten
        // delete sv._gesture; // TODO: Move to sv.prevGesture?
    },

    /**
     * Setter for 'axis' attribute
     *
     * @method _axisSetter
     * @param val {Mixed} A string ('x', 'y', 'xy') to specify which axis/axes to allow scrolling on
     * @param name {String} The attribute name
     * @return {Object} An object to specify scrollability on the x & y axes
     *
     * @protected
     */
    _axisSetter: function (val) {

        // Turn a string into an axis object
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_axisSetter", 1147);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1150);
if (Y.Lang.isString(val)) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1151);
return {
                x: val.match(/x/i) ? true : false,
                y: val.match(/y/i) ? true : false
            };
        }
    },
    
    /**
    * The scrollX, scrollY setter implementation
    *
    * @method _setScroll
    * @private
    * @param {Number} val
    * @param {String} dim
    *
    * @return {Number} The value
    */
    _setScroll : function(val) {

        // Just ensure the widget is not disabled
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_setScroll", 1168);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1171);
if (this._cDisabled) {
            _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1172);
val = Y.Attribute.INVALID_VALUE;
        }

        _yuitest_coverline("build/scrollview-base/scrollview-base.js", 1175);
return val;
    },

    /**
    * Setter for the scrollX attribute
    *
    * @method _setScrollX
    * @param val {Number} The new scrollX value
    * @return {Number} The normalized value
    * @protected
    */
    _setScrollX: function(val) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_setScrollX", 1186);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1187);
return this._setScroll(val, DIM_X);
    },

    /**
    * Setter for the scrollY ATTR
    *
    * @method _setScrollY
    * @param val {Number} The new scrollY value
    * @return {Number} The normalized value
    * @protected
    */
    _setScrollY: function(val) {
        _yuitest_coverfunc("build/scrollview-base/scrollview-base.js", "_setScrollY", 1198);
_yuitest_coverline("build/scrollview-base/scrollview-base.js", 1199);
return this._setScroll(val, DIM_Y);
    }

    // End prototype properties

}, {

    // Static properties

    /**
     * The identity of the widget.
     *
     * @property NAME
     * @type String
     * @default 'scrollview'
     * @readOnly
     * @protected
     * @static
     */
    NAME: 'scrollview',

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property ATTRS
     * @type {Object}
     * @protected
     * @static
     */
    ATTRS: {

        /**
         * Specifies ability to scroll on x, y, or x and y axis/axes.
         *
         * @attribute axis
         * @type String
         */
        axis: {
            setter: '_axisSetter',
            writeOnce: 'initOnly'
        },

        /**
         * The current scroll position in the x-axis
         *
         * @attribute scrollX
         * @type Number
         * @default 0
         */
        scrollX: {
            value: 0,
            setter: '_setScrollX'
        },

        /**
         * The current scroll position in the y-axis
         *
         * @attribute scrollY
         * @type Number
         * @default 0
         */
        scrollY: {
            value: 0,
            setter: '_setScrollY'
        },

        /**
         * Drag coefficent for inertial scrolling. The closer to 1 this
         * value is, the less friction during scrolling.
         *
         * @attribute deceleration
         * @default 0.93
         */
        deceleration: {
            value: 0.93
        },

        /**
         * Drag coefficient for intertial scrolling at the upper
         * and lower boundaries of the scrollview. Set to 0 to
         * disable "rubber-banding".
         *
         * @attribute bounce
         * @type Number
         * @default 0.1
         */
        bounce: {
            value: 0.1
        },

        /**
         * The minimum distance and/or velocity which define a flick. Can be set to false,
         * to disable flick support (note: drag support is enabled/disabled separately)
         *
         * @attribute flick
         * @type Object
         * @default Object with properties minDistance = 10, minVelocity = 0.3.
         */
        flick: {
            value: {
                minDistance: 10,
                minVelocity: 0.3
            }
        },

        /**
         * Enable/Disable dragging the ScrollView content (note: flick support is enabled/disabled separately)
         * @attribute drag
         * @type boolean
         * @default true
         */
        drag: {
            value: true
        },

        /**
         * The default duration to use when animating the bounce snap back.
         *
         * @attribute snapDuration
         * @type Number
         * @default 400
         */
        snapDuration: {
            value: 400
        },

        /**
         * The default easing to use when animating the bounce snap back.
         *
         * @attribute snapEasing
         * @type String
         * @default 'ease-out'
         */
        snapEasing: {
            value: 'ease-out'
        },

        /**
         * The default easing used when animating the flick
         *
         * @attribute easing
         * @type String
         * @default 'cubic-bezier(0, 0.1, 0, 1.0)'
         */
        easing: {
            value: 'cubic-bezier(0, 0.1, 0, 1.0)'
        },

        /**
         * The interval (ms) used when animating the flick for JS-timer animations
         *
         * @attribute frameDuration
         * @type Number
         * @default 15
         */
        frameDuration: {
            value: 15
        },

        /**
         * The default bounce distance in pixels
         *
         * @attribute bounceRange
         * @type Number
         * @default 150
         */
        bounceRange: {
            value: 150
        },

        /**
         * Prevent scrollview from nesting problems
         *
         * @attribute nesting
         * @type Boolean
         * @default true
         */
        nesting: {
            value: true
        }
    },

    /**
     * List of class names used in the scrollview's DOM
     *
     * @property CLASS_NAMES
     * @type Object
     * @static
     */
    CLASS_NAMES: CLASS_NAMES,

    /**
     * Flag used to source property changes initiated from the DOM
     *
     * @property UI_SRC
     * @type String
     * @static
     * @default 'ui'
     */
    UI_SRC: UI,

    /**
     * Object map of style property names used to set transition properties.
     * Defaults to the vendor prefix established by the Transition module.
     * The configured property names are `_TRANSITION.DURATION` (e.g. "WebkitTransitionDuration") and
     * `_TRANSITION.PROPERTY (e.g. "WebkitTransitionProperty").
     *
     * @property _TRANSITION
     * @private
     */
    _TRANSITION: {
        DURATION: (vendorPrefix ? vendorPrefix + 'TransitionDuration' : 'transitionDuration'),
        PROPERTY: (vendorPrefix ? vendorPrefix + 'TransitionProperty' : 'transitionProperty')
    },

    /**
     * The default bounce distance in pixels
     *
     * @property BOUNCE_RANGE
     * @type Number
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    BOUNCE_RANGE: false,

    /**
     * The interval (ms) used when animating the flick
     *
     * @property FRAME_STEP
     * @type Number
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    FRAME_STEP: false,

    /**
     * The default easing used when animating the flick
     *
     * @property EASING
     * @type String
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    EASING: false,

    /**
     * The default easing to use when animating the bounce snap back.
     *
     * @property SNAP_EASING
     * @type String
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    SNAP_EASING: false,

    /**
     * The default duration to use when animating the bounce snap back.
     *
     * @property SNAP_DURATION
     * @type Number
     * @static
     * @default false
     * @deprecated (in 3.7.0)
     */
    SNAP_DURATION: false

    // End static properties

});

}, '@VERSION@', {"requires": ["widget", "event-gestures", "event-mousewheel", "transition"], "skinnable": true});
