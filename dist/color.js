System.register([], function (exports_1, context_1) {
    "use strict";
    var Color;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Color = (function () {
                function Color(r, g, b) {
                    this.r = r;
                    this.g = g;
                    this.b = b;
                }
                Color.prototype.asHex = function () {
                    return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
                };
                Color.prototype.asRGB = function () {
                    return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
                };
                Color.prototype.blendWith = function (col, a) {
                    var r = Math.round(col.r * (1 - a) + this.r * a);
                    var g = Math.round(col.g * (1 - a) + this.g * a);
                    var b = Math.round(col.b * (1 - a) + this.b * a);
                    return new Color(r, g, b);
                };
                Color.prototype.Mul = function (col, a) {
                    var r = Math.round(col.r / 255 * this.r * a);
                    var g = Math.round(col.g / 255 * this.g * a);
                    var b = Math.round(col.b / 255 * this.b * a);
                    return new Color(r, g, b);
                };
                Color.prototype.fromHex = function (hex) {
                    hex = hex.substring(1, 7);
                    var bigint = parseInt(hex, 16);
                    this.r = (bigint >> 16) & 255;
                    this.g = (bigint >> 8) & 255;
                    this.b = bigint & 255;
                };
                Color.createGradients = function (data) {
                    var gradients = [];
                    var purelight = new Color(255, 255, 255);
                    for (var i = 0; i < data.length; i++) {
                        var aColorStart = new Color(0, 0, 0);
                        aColorStart.fromHex(data[i].color);
                        var aColorEnd = aColorStart.Mul(purelight, 0.7);
                        gradients.push({ start: aColorStart.asHex(), end: aColorEnd.asHex() });
                    }
                    return gradients;
                };
                return Color;
            }());
            exports_1("Color", Color);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29sb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztZQU1BO2dCQUtFLGVBQVksQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTO29CQUN6QyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDYixDQUFDO2dCQUVELHFCQUFLLEdBQUw7b0JBQ0UsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRixDQUFDO2dCQUVELHFCQUFLLEdBQUw7b0JBQ0UsT0FBTyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQzdELENBQUM7Z0JBRUQseUJBQVMsR0FBVCxVQUFVLEdBQUcsRUFBRSxDQUFDO29CQUNkLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELE9BQU8sSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUIsQ0FBQztnQkFFRCxtQkFBRyxHQUFILFVBQUksR0FBRyxFQUFFLENBQUM7b0JBQ1IsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUM3QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzdDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDN0MsT0FBTyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixDQUFDO2dCQUVELHVCQUFPLEdBQVAsVUFBUSxHQUFHO29CQUVULEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDL0IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7b0JBQzlCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO29CQUM3QixJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUM7Z0JBQ3hCLENBQUM7Z0JBRU0scUJBQWUsR0FBdEIsVUFBdUIsSUFBUztvQkFDOUIsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO29CQUNuQixJQUFJLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUN6QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDcEMsSUFBSSxXQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDckMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ25DLElBQUksU0FBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNoRCxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFDLENBQUMsQ0FBQztxQkFDdEU7b0JBQ0QsT0FBTyxTQUFTLENBQUM7Z0JBQ25CLENBQUM7Z0JBQ0gsWUFBQztZQUFELENBQUMsQUFyREQsSUFxREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuIEdlbmVyaWMgY2xhc3MgdG8gcHJvdmlkZSBncmFkaWVudCBjb2xvcnNcblxuIEJhc2VkIG9uIGh0dHBzOi8vY29kZXBlbi5pby9hbm9uL3Blbi93V3hHa3JcblxuKi9cbmV4cG9ydCBjbGFzcyBDb2xvciB7XG4gIHI6IG51bWJlcjtcbiAgZzogbnVtYmVyO1xuICBiOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikge1xuICAgIHRoaXMuciA9IHI7XG4gICAgdGhpcy5nID0gZztcbiAgICB0aGlzLmIgPSBiO1xuICB9XG5cbiAgYXNIZXgoKSB7XG4gICAgcmV0dXJuIFwiI1wiICsgKCgxIDw8IDI0KSArICh0aGlzLnIgPDwgMTYpICsgKHRoaXMuZyA8PCA4KSArIHRoaXMuYikudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xuICB9XG5cbiAgYXNSR0IoKSB7XG4gICAgcmV0dXJuIFwicmdiKFwiICsgdGhpcy5yICsgXCIsXCIgKyB0aGlzLmcgKyBcIixcIiArIHRoaXMuYiArIFwiKVwiO1xuICB9XG5cbiAgYmxlbmRXaXRoKGNvbCwgYSkge1xuICAgIGxldCByID0gTWF0aC5yb3VuZChjb2wuciAqICgxIC0gYSkgKyB0aGlzLnIgKiBhKTtcbiAgICBsZXQgZyA9IE1hdGgucm91bmQoY29sLmcgKiAoMSAtIGEpICsgdGhpcy5nICogYSk7XG4gICAgbGV0IGIgPSBNYXRoLnJvdW5kKGNvbC5iICogKDEgLSBhKSArIHRoaXMuYiAqIGEpO1xuICAgIHJldHVybiBuZXcgQ29sb3IociwgZywgYik7XG4gIH1cblxuICBNdWwoY29sLCBhKSB7XG4gICAgbGV0IHIgPSBNYXRoLnJvdW5kKGNvbC5yIC8gMjU1ICogdGhpcy5yICogYSk7XG4gICAgbGV0IGcgPSBNYXRoLnJvdW5kKGNvbC5nIC8gMjU1ICogdGhpcy5nICogYSk7XG4gICAgbGV0IGIgPSBNYXRoLnJvdW5kKGNvbC5iIC8gMjU1ICogdGhpcy5iICogYSk7XG4gICAgcmV0dXJuIG5ldyBDb2xvcihyLCBnLCBiKTtcbiAgfVxuXG4gIGZyb21IZXgoaGV4KSB7XG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NjIzODM4L3JnYi10by1oZXgtYW5kLWhleC10by1yZ2JcbiAgICBoZXggPSBoZXguc3Vic3RyaW5nKDEsIDcpO1xuICAgIHZhciBiaWdpbnQgPSBwYXJzZUludChoZXgsIDE2KTtcbiAgICB0aGlzLnIgPSAoYmlnaW50ID4+IDE2KSAmIDI1NTtcbiAgICB0aGlzLmcgPSAoYmlnaW50ID4+IDgpICYgMjU1O1xuICAgIHRoaXMuYiA9IGJpZ2ludCAmIDI1NTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVHcmFkaWVudHMoZGF0YTogYW55KTogYW55IHtcbiAgICBsZXQgZ3JhZGllbnRzID0gW107XG4gICAgbGV0IHB1cmVsaWdodCA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBhQ29sb3JTdGFydCA9IG5ldyBDb2xvcigwLCAwLCAwKTtcbiAgICAgIGFDb2xvclN0YXJ0LmZyb21IZXgoZGF0YVtpXS5jb2xvcik7XG4gICAgICBsZXQgYUNvbG9yRW5kID0gYUNvbG9yU3RhcnQuTXVsKHB1cmVsaWdodCwgMC43KTtcbiAgICAgIGdyYWRpZW50cy5wdXNoKHtzdGFydDogYUNvbG9yU3RhcnQuYXNIZXgoKSwgZW5kOiBhQ29sb3JFbmQuYXNIZXgoKX0pO1xuICAgIH1cbiAgICByZXR1cm4gZ3JhZGllbnRzO1xuICB9XG59XG4iXX0=