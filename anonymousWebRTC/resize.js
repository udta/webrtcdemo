var isIE = (document.all) ? true : false;

    var $$ = function(id) {
        return "string" == typeof id ? document.getElementById(id) : id;
    };

    var Class = {
        create: function() {
            return function() {
                this.initialize.apply(this, arguments);
            }
        }
    }

    var Extend = function(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
    }

    var Bind = function(object, fun) {
        return function() {
            return fun.apply(object, arguments);
        }
    }

    var BindAsEventListener = function(object, fun) {
        var args = Array.prototype.slice.call(arguments).slice(2);
        return function(event) {
            return fun.apply(object, [event || window.event].concat(args));
        }
    }

    var CurrentStyle = function(element) {
        return element.currentStyle || document.defaultView.getComputedStyle(element, null);
    }

    function addEventHandler(oTarget, sEventType, fnHandler) {
        if (oTarget.addEventListener) {
            oTarget.addEventListener(sEventType, fnHandler, false);
        } else if (oTarget.attachEvent) {
            oTarget.attachEvent("on" + sEventType, fnHandler);
        } else {
            oTarget["on" + sEventType] = fnHandler;
        }
    };

    function removeEventHandler(oTarget, sEventType, fnHandler) {
        if (oTarget.removeEventListener) {
            oTarget.removeEventListener(sEventType, fnHandler, false);
        } else if (oTarget.detachEvent) {
            oTarget.detachEvent("on" + sEventType, fnHandler);
        } else {
            oTarget["on" + sEventType] = null;
        }
    };


    //??��?3��D��
    var Resize = Class.create();
    Resize.prototype = {
        //??��????��
        initialize: function(obj, options) {
            this._obj = $$(obj); //??��????��

            this._styleWidth = this._styleHeight = this._styleLeft = this._styleTop = 0; //?����?2?��y
            this._sideRight = this._sideDown = this._sideLeft = this._sideUp = 0; //��?����2?��y
            this._fixLeft = this._fixTop = 0; //?��??2?��y
            this._scaleLeft = this._scaleTop = 0; //?��??��?����

            this._mxSet = function() {}; //��??�쨦��??3��D��
            this._mxRightWidth = this._mxDownHeight = this._mxUpHeight = this._mxLeftWidth = 0; //��??��2?��y
            this._mxScaleWidth = this._mxScaleHeight = 0; //������y��??��2?��y

            this._fun = function() {}; //??��??��DD3��D��

            //??��?��??��?��?��
            var _style = CurrentStyle(this._obj);
            this._borderX = (parseInt(_style.borderLeftWidth) || 0) + (parseInt(_style.borderRightWidth) || 0);
            this._borderY = (parseInt(_style.borderTopWidth) || 0) + (parseInt(_style.borderBottomWidth) || 0);
            //��??t???��(��?�����㨮?����?3y��??t)
            this._fR = BindAsEventListener(this, this.Resize);
            this._fS = Bind(this, this.Stop);

            this.SetOptions(options);
            //��??��?T??
            this.Max = !!this.options.Max;
            this._mxContainer = $$(this.options.mxContainer) || null;
            this.mxLeft = Math.round(this.options.mxLeft);
            this.mxRight = Math.round(this.options.mxRight);
            this.mxTop = Math.round(this.options.mxTop);
            this.mxBottom = Math.round(this.options.mxBottom);
            //?��???T??
            this.Min = !!this.options.Min;
            this.minWidth = Math.round(this.options.minWidth);
            this.minHeight = Math.round(this.options.minHeight);
            //��������y??��?
            this.Scale = !!this.options.Scale;
            this.Ratio = Math.max(this.options.Ratio, 0);

            this.onResize = this.options.onResize;

            this._obj.style.position = "absolute";
            !this._mxContainer || CurrentStyle(this._mxContainer).position == "relative" || (this._mxContainer.style.position = "relative");
        },
        //����????��?��?D?
        SetOptions: function(options) {
            this.options = { //??��??��
                Max: false, //��?��?����??��??��?T??(?atrue����????mx2?��y��D��?)
                mxContainer: "", //???��?T???����Y?��?��
                mxLeft: 0, //������??T??
                mxRight: 9999, //������??T??
                mxTop: 0, //��?��??T??
                mxBottom: 9999, //??��??T??
                Min: false, //��?��?��?D??��???T??(?atrue����????min2?��y��D��?)
                minWidth: 50, //��?D??��?��
                minHeight: 50, //��?D????��
                Scale: false, //��?��?��������y??��?
                Ratio: 0, //??��?������y(?��/??)
                onResize: function() {} //??��?����?��DD
            };
            Extend(this.options, options || {});
        },
        //����??�䣤����???��
        Set: function(resize, side) {
            var resize = $$(resize),
                fun;
            if (!resize) return;
            //?��?Y��??������??
            switch (side.toLowerCase()) {
                case "up":
                    fun = this.Up;
                    break;
                case "down":
                    fun = this.Down;
                    break;
                case "left":
                    fun = this.Left;
                    break;
                case "right":
                    fun = this.Right;
                    break;
                case "left-up":
                    fun = this.LeftUp;
                    break;
                case "right-up":
                    fun = this.RightUp;
                    break;
                case "left-down":
                    fun = this.LeftDown;
                    break;
                case "right-down":
                default:
                    fun = this.RightDown;
            };
            //����??�䣤����???��
            addEventHandler(resize, "mousedown", BindAsEventListener(this, this.Start, fun));
        },
        //��?��???��?
        Start: function(e, fun, touch) {
            //����?1?��?Y(?����?��???o?��������??)
            e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
            //����???��DD3��D��
            this._fun = fun;
            //?����?2?��y?��
            this._styleWidth = this._obj.clientWidth;
            this._styleHeight = this._obj.clientHeight;
            this._styleLeft = this._obj.offsetLeft;
            this._styleTop = this._obj.offsetTop;
            //??��?��??��??��?����
            this._sideLeft = e.clientX - this._styleWidth;
            this._sideRight = e.clientX + this._styleWidth;
            this._sideUp = e.clientY - this._styleHeight;
            this._sideDown = e.clientY + this._styleHeight;
            //topo��left?��??2?��y
            this._fixLeft = this._styleLeft + this._styleWidth;
            this._fixTop = this._styleTop + this._styleHeight;
            //??��?������y
            if (this.Scale) {
                //����??������y
                this.Ratio = Math.max(this.Ratio, 0) || this._styleWidth / this._styleHeight;
                //lefto��top��??��??��?����
                this._scaleLeft = this._styleLeft + this._styleWidth / 2;
                this._scaleTop = this._styleTop + this._styleHeight / 2;
            };
            //��??��?T??
            if (this.Max) {
                //����??��??��2?��y
                var mxLeft = this.mxLeft,
                    mxRight = this.mxRight,
                    mxTop = this.mxTop,
                    mxBottom = this.mxBottom;
                //��?1?����??��?��Y?�¡�??��DT?y��??��2?��y
                if (!!this._mxContainer) {
                    mxLeft = Math.max(mxLeft, 0);
                    mxTop = Math.max(mxTop, 0);
                    mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
                    mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
                };
                //?��?Y��?D??��?��DT?y
                mxRight = Math.max(mxRight, mxLeft + (this.Min ? this.minWidth : 0) + this._borderX);
                mxBottom = Math.max(mxBottom, mxTop + (this.Min ? this.minHeight : 0) + this._borderY);
                //����������a?��������a??D?����???����?D��3��functionD?��?
                this._mxSet = function() {
                    this._mxRightWidth = mxRight - this._styleLeft - this._borderX;
                    this._mxDownHeight = mxBottom - this._styleTop - this._borderY;
                    this._mxUpHeight = Math.max(this._fixTop - mxTop, this.Min ? this.minHeight : 0);
                    this._mxLeftWidth = Math.max(this._fixLeft - mxLeft, this.Min ? this.minWidth : 0);
                };
                this._mxSet();
                //��D??��?������y??��?��??��?T??
                if (this.Scale) {
                    this._mxScaleWidth = Math.min(this._scaleLeft - mxLeft, mxRight - this._scaleLeft - this._borderX) * 2;
                    this._mxScaleHeight = Math.min(this._scaleTop - mxTop, mxBottom - this._scaleTop - this._borderY) * 2;
                };
            };
            //mousemove����??��? mouseup��������?1
            addEventHandler(document, "mousemove", this._fR);
            addEventHandler(document, "mouseup", this._fS);
            if (isIE) {
                addEventHandler(this._obj, "losecapture", this._fS);
                this._obj.setCapture();
            } else {
                addEventHandler(window, "blur", this._fS);
                e.preventDefault();
            };
        },
        //??��?
        Resize: function(e) {
            //??3y????
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            //?��DD??��?3��D��
            this._fun(e);
            //����???����?��?��?��?��?D?�䨮�����̨�����0��??��ie3?�䨪
            with(this._obj.style) {
                    width = this._styleWidth + "px";
                    height = this._styleHeight + "px";
                    top = this._styleTop + "px";
                    left = this._styleLeft + "px";
                }
                //???��3��D��
            this.onResize();
        },
        //??��?3��D��
        //��?
        Up: function(e) {
            this.RepairY(this._sideDown - e.clientY, this._mxUpHeight);
            this.RepairTop();
            this.TurnDown(this.Down);
        },
        //??
        Down: function(e) {
            this.RepairY(e.clientY - this._sideUp, this._mxDownHeight);
            this.TurnUp(this.Up);
        },
        //����
        Right: function(e) {
            this.RepairX(e.clientX - this._sideLeft, this._mxRightWidth);
            this.TurnLeft(this.Left);
        },
        //����
        Left: function(e) {
            this.RepairX(this._sideRight - e.clientX, this._mxLeftWidth);
            this.RepairLeft();
            this.TurnRight(this.Right);
        },
        //����??
        RightDown: function(e) {
            this.RepairAngle(
                e.clientX - this._sideLeft, this._mxRightWidth,
                e.clientY - this._sideUp, this._mxDownHeight
            );
            this.TurnLeft(this.LeftDown) || this.Scale || this.TurnUp(this.RightUp);
        },
        //������?
        RightUp: function(e) {
            this.RepairAngle(
                e.clientX - this._sideLeft, this._mxRightWidth,
                this._sideDown - e.clientY, this._mxUpHeight
            );
            this.RepairTop();
            this.TurnLeft(this.LeftUp) || this.Scale || this.TurnDown(this.RightDown);
        },
        //����??
        LeftDown: function(e) {
            this.RepairAngle(
                this._sideRight - e.clientX, this._mxLeftWidth,
                e.clientY - this._sideUp, this._mxDownHeight
            );
            this.RepairLeft();
            this.TurnRight(this.RightDown) || this.Scale || this.TurnUp(this.LeftUp);
        },
        //������?
        LeftUp: function(e) {
            this.RepairAngle(
                this._sideRight - e.clientX, this._mxLeftWidth,
                this._sideDown - e.clientY, this._mxUpHeight
            );
            this.RepairTop();
            this.RepairLeft();
            this.TurnRight(this.RightUp) || this.Scale || this.TurnDown(this.LeftDown);
        },
        //DT?y3��D��
        //????��??��
        RepairX: function(iWidth, mxWidth) {
            iWidth = this.RepairWidth(iWidth, mxWidth);
            if (this.Scale) {
                var iHeight = this.RepairScaleHeight(iWidth);
                if (this.Max && iHeight > this._mxScaleHeight) {
                    iHeight = this._mxScaleHeight;
                    iWidth = this.RepairScaleWidth(iHeight);
                } else if (this.Min && iHeight < this.minHeight) {
                    var tWidth = this.RepairScaleWidth(this.minHeight);
                    if (tWidth < mxWidth) {
                        iHeight = this.minHeight;
                        iWidth = tWidth;
                    }
                }
                this._styleHeight = iHeight;
                this._styleTop = this._scaleTop - iHeight / 2;
            }
            this._styleWidth = iWidth;
        },
        //��1?����??��
        RepairY: function(iHeight, mxHeight) {
            iHeight = this.RepairHeight(iHeight, mxHeight);
            if (this.Scale) {
                var iWidth = this.RepairScaleWidth(iHeight);
                if (this.Max && iWidth > this._mxScaleWidth) {
                    iWidth = this._mxScaleWidth;
                    iHeight = this.RepairScaleHeight(iWidth);
                } else if (this.Min && iWidth < this.minWidth) {
                    var tHeight = this.RepairScaleHeight(this.minWidth);
                    if (tHeight < mxHeight) {
                        iWidth = this.minWidth;
                        iHeight = tHeight;
                    }
                }
                this._styleWidth = iWidth;
                this._styleLeft = this._scaleLeft - iWidth / 2;
            }
            this._styleHeight = iHeight;
        },
        //????��??��
        RepairAngle: function(iWidth, mxWidth, iHeight, mxHeight) {
            iWidth = this.RepairWidth(iWidth, mxWidth);
            if (this.Scale) {
                iHeight = this.RepairScaleHeight(iWidth);
                if (this.Max && iHeight > mxHeight) {
                    iHeight = mxHeight;
                    iWidth = this.RepairScaleWidth(iHeight);
                } else if (this.Min && iHeight < this.minHeight) {
                    var tWidth = this.RepairScaleWidth(this.minHeight);
                    if (tWidth < mxWidth) {
                        iHeight = this.minHeight;
                        iWidth = tWidth;
                    }
                }
            } else {
                iHeight = this.RepairHeight(iHeight, mxHeight);
            }
            this._styleWidth = iWidth;
            this._styleHeight = iHeight;
        },
        //top
        RepairTop: function() {
            this._styleTop = this._fixTop - this._styleHeight;
        },
        //left
        RepairLeft: function() {
            this._styleLeft = this._fixLeft - this._styleWidth;
        },
        //height
        RepairHeight: function(iHeight, mxHeight) {
            iHeight = Math.min(this.Max ? mxHeight : iHeight, iHeight);
            iHeight = Math.max(this.Min ? this.minHeight : iHeight, iHeight, 0);
            return iHeight;
        },
        //width
        RepairWidth: function(iWidth, mxWidth) {
            iWidth = Math.min(this.Max ? mxWidth : iWidth, iWidth);
            iWidth = Math.max(this.Min ? this.minWidth : iWidth, iWidth, 0);
            return iWidth;
        },
        //������y???��
        RepairScaleHeight: function(iWidth) {
            return Math.max(Math.round((iWidth + this._borderX) / this.Ratio - this._borderY), 0);
        },
        //������y?��?��
        RepairScaleWidth: function(iHeight) {
            return Math.max(Math.round((iHeight + this._borderY) * this.Ratio - this._borderX), 0);
        },
        //��a?��3��D��
        //��a����
        TurnRight: function(fun) {
            if (!(this.Min || this._styleWidth)) {
                this._fun = fun;
                this._sideLeft = this._sideRight;
                this.Max && this._mxSet();
                return true;
            }
        },
        //��a����
        TurnLeft: function(fun) {
            if (!(this.Min || this._styleWidth)) {
                this._fun = fun;
                this._sideRight = this._sideLeft;
                this._fixLeft = this._styleLeft;
                this.Max && this._mxSet();
                return true;
            }
        },
        //��a��?
        TurnUp: function(fun) {
            if (!(this.Min || this._styleHeight)) {
                this._fun = fun;
                this._sideDown = this._sideUp;
                this._fixTop = this._styleTop;
                this.Max && this._mxSet();
                return true;
            }
        },
        //��a??
        TurnDown: function(fun) {
            if (!(this.Min || this._styleHeight)) {
                this._fun = fun;
                this._sideUp = this._sideDown;
                this.Max && this._mxSet();
                return true;
            }
        },
        //����?1??��?
        Stop: function() {
            removeEventHandler(document, "mousemove", this._fR);
            removeEventHandler(document, "mouseup", this._fS);
            if (isIE) {
                removeEventHandler(this._obj, "losecapture", this._fS);
                this._obj.releaseCapture();
            } else {
                removeEventHandler(window, "blur", this._fS);
            }
        }
    };