System.register(["lodash", "app/core/utils/kbn", "./threshold_processor"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, kbn_1, threshold_processor_1, MetricComposite, CompositesManager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            },
            function (threshold_processor_1_1) {
                threshold_processor_1 = threshold_processor_1_1;
            }
        ],
        execute: function () {
            MetricComposite = (function () {
                function MetricComposite() {
                }
                return MetricComposite;
            }());
            exports_1("MetricComposite", MetricComposite);
            CompositesManager = (function () {
                function CompositesManager($scope, templateSrv, $sanitize, savedComposites) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$sanitize = $sanitize;
                    this.templateSrv = templateSrv;
                    this.subTabIndex = 0;
                    this.suggestMetricNames = function () {
                        return lodash_1.default.map(_this.$scope.ctrl.series, function (series) {
                            return series.alias;
                        });
                    };
                    this.metricComposites = savedComposites;
                    for (var index = 0; index < this.metricComposites.length; index++) {
                        if (typeof this.metricComposites[index].label === "undefined") {
                            this.metricComposites[index].label = "COMPOSITE " + (index + 1);
                        }
                    }
                }
                CompositesManager.prototype.addMetricComposite = function () {
                    var aComposite = new MetricComposite();
                    aComposite.label = "COMPOSITE " + (this.metricComposites.length + 1);
                    aComposite.compositeName = "";
                    aComposite.members = [{}];
                    aComposite.enabled = true;
                    aComposite.clickThrough = "";
                    aComposite.hideMembers = true;
                    aComposite.showName = true;
                    aComposite.showValue = true;
                    aComposite.animateMode = "all";
                    aComposite.thresholdLevel = 0;
                    aComposite.sanitizeURLEnabled = true;
                    aComposite.sanitizedURL = "";
                    this.metricComposites.push(aComposite);
                };
                CompositesManager.prototype.removeMetricComposite = function (item) {
                    this.metricComposites = lodash_1.default.without(this.metricComposites, item);
                    for (var index = 0; index < this.metricComposites.length; index++) {
                        this.metricComposites[index].label = "COMPOSITE " + (index + 1);
                    }
                    this.$scope.ctrl.panel.savedComposites = this.metricComposites;
                    this.$scope.ctrl.refresh();
                };
                CompositesManager.prototype.addMetricToComposite = function (composite) {
                    if (composite.members === undefined) {
                        composite.members = [{}];
                    }
                    else {
                        composite.members.push({});
                    }
                    this.$scope.ctrl.refresh();
                };
                CompositesManager.prototype.removeMetricFromComposite = function (composite, metric) {
                    composite.members = lodash_1.default.without(composite.members, metric);
                    this.$scope.ctrl.refresh();
                };
                CompositesManager.prototype.matchComposite = function (pattern) {
                    for (var index = 0; index < this.metricComposites.length; index++) {
                        var aComposite = this.metricComposites[index];
                        var regex = kbn_1.default.stringToJsRegex(aComposite.compositeName);
                        var matches = pattern.match(regex);
                        if (matches && matches.length > 0 && aComposite.enabled) {
                            return index;
                        }
                    }
                    return -1;
                };
                CompositesManager.prototype.applyComposites = function (data) {
                    var filteredMetrics = new Array();
                    var clonedComposites = new Array();
                    for (var i = 0; i < this.metricComposites.length; i++) {
                        var matchedMetrics = new Array();
                        var aComposite = this.metricComposites[i];
                        if (!aComposite.enabled) {
                            continue;
                        }
                        var currentWorstSeries = null;
                        for (var j = 0; j < aComposite.members.length; j++) {
                            var aMetric = aComposite.members[j];
                            for (var index = 0; index < data.length; index++) {
                                if (typeof aMetric.seriesName === "undefined") {
                                    continue;
                                }
                                var regex = kbn_1.default.stringToJsRegex(aMetric.seriesName);
                                var matches = data[index].name.match(regex);
                                if (matches && matches.length > 0) {
                                    var seriesItem = data[index];
                                    matchedMetrics.push(index);
                                    if (aComposite.hideMembers) {
                                        filteredMetrics.push(index);
                                    }
                                    if (aComposite.clickThrough.length > 0) {
                                        seriesItem.clickThrough = aComposite.clickThrough;
                                        seriesItem.sanitizedURL = this.$sanitize(aComposite.clickThrough);
                                    }
                                }
                            }
                        }
                        if (matchedMetrics.length === 0) {
                            continue;
                        }
                        for (var k = 0; k < matchedMetrics.length; k++) {
                            var itemIndex = matchedMetrics[k];
                            var seriesItem = data[itemIndex];
                            if (currentWorstSeries === null) {
                                currentWorstSeries = seriesItem;
                            }
                            else {
                                currentWorstSeries = threshold_processor_1.getWorstSeries(currentWorstSeries, seriesItem, this.$scope.ctrl.panel.polystat.polygonGlobalFillColor);
                            }
                        }
                        if (currentWorstSeries !== null) {
                            var clone = currentWorstSeries.shallowClone();
                            clone.name = aComposite.compositeName;
                            for (var index = 0; index < matchedMetrics.length; index++) {
                                var itemIndex = matchedMetrics[index];
                                clone.members.push(data[itemIndex]);
                            }
                            clone.thresholdLevel = currentWorstSeries.thresholdLevel;
                            clone.showName = aComposite.showName;
                            clone.showValue = aComposite.showValue;
                            clone.animateMode = aComposite.animateMode;
                            clone.isComposite = true;
                            clonedComposites.push(clone);
                        }
                    }
                    Array.prototype.push.apply(data, clonedComposites);
                    filteredMetrics.sort(function (a, b) { return b - a; });
                    for (var i = data.length; i >= 0; i--) {
                        if (lodash_1.default.includes(filteredMetrics, i)) {
                            data.splice(i, 1);
                        }
                    }
                    return data;
                };
                CompositesManager.prototype.metricNameChanged = function (item) {
                    console.log(item);
                    this.$scope.ctrl.refresh();
                };
                CompositesManager.prototype.toggleHide = function (composite) {
                    console.log("composite enabled =  " + composite.enabled);
                    composite.enabled = !composite.enabled;
                    this.$scope.ctrl.refresh();
                };
                return CompositesManager;
            }());
            exports_1("CompositesManager", CompositesManager);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9zaXRlc19tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvc2l0ZXNfbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztZQU1BO2dCQUFBO2dCQWFBLENBQUM7Z0JBQUQsc0JBQUM7WUFBRCxDQUFDLEFBYkQsSUFhQzs7WUFFRDtnQkFRSSwyQkFBWSxNQUFNLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxlQUFlO29CQUEzRCxpQkFrQkM7b0JBakJDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO29CQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0JBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO29CQUVyQixJQUFJLENBQUMsa0JBQWtCLEdBQUc7d0JBQ3hCLE9BQU8sZ0JBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsTUFBTTs0QkFDcEQsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUN0QixDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDLENBQUM7b0JBQ0YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztvQkFFeEMsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7d0JBQ2pFLElBQUksT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTs0QkFDN0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxZQUFZLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7eUJBQ2pF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QyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDckMsSUFBSSxnQkFBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLEVBQUU7NEJBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3lCQUNuQjtxQkFDRjtvQkFDRCxPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVELDZDQUFpQixHQUFqQixVQUFrQixJQUFJO29CQUVsQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDL0IsQ0FBQztnQkFFRCxzQ0FBVSxHQUFWLFVBQVcsU0FBUztvQkFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3pELFNBQVMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO29CQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDN0IsQ0FBQztnQkFDTCx3QkFBQztZQUFELENBQUMsQUF0TEQsSUFzTEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvZ3JhZmFuYS1zZGstbW9ja3MvYXBwL2hlYWRlcnMvY29tbW9uLmQudHNcIiAvPlxuXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQga2JuIGZyb20gXCJhcHAvY29yZS91dGlscy9rYm5cIjtcbmltcG9ydCB7IFBvbHlzdGF0TW9kZWwgfSBmcm9tIFwiLi9wb2x5c3RhdG1vZGVsXCI7XG5pbXBvcnQgeyBnZXRXb3JzdFNlcmllcyB9IGZyb20gXCIuL3RocmVzaG9sZF9wcm9jZXNzb3JcIjtcbmV4cG9ydCBjbGFzcyBNZXRyaWNDb21wb3NpdGUge1xuICAgIGNvbXBvc2l0ZU5hbWU6IHN0cmluZztcbiAgICBtZW1iZXJzOiBBcnJheTxhbnk+O1xuICAgIGVuYWJsZWQ6IGJvb2xlYW47XG4gICAgaGlkZU1lbWJlcnM6IGJvb2xlYW47XG4gICAgc2hvd05hbWU6IGJvb2xlYW47XG4gICAgc2hvd1ZhbHVlOiBib29sZWFuO1xuICAgIGFuaW1hdGVNb2RlOiBzdHJpbmc7XG4gICAgdGhyZXNob2xkTGV2ZWw6IG51bWJlcjtcbiAgICBjbGlja1Rocm91Z2g6IHN0cmluZztcbiAgICBzYW5pdGl6ZVVSTEVuYWJsZWQ6IGJvb2xlYW47XG4gICAgc2FuaXRpemVkVVJMOiBzdHJpbmc7XG4gICAgbGFiZWw6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIENvbXBvc2l0ZXNNYW5hZ2VyIHtcbiAgICAkc2NvcGU6IGFueTtcbiAgICB0ZW1wbGF0ZVNydjogYW55O1xuICAgICRzYW5pdGl6ZTogYW55O1xuICAgIHN1Z2dlc3RNZXRyaWNOYW1lczogYW55O1xuICAgIG1ldHJpY0NvbXBvc2l0ZXM6IEFycmF5PE1ldHJpY0NvbXBvc2l0ZT47XG4gICAgc3ViVGFiSW5kZXg6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKCRzY29wZSwgdGVtcGxhdGVTcnYsICRzYW5pdGl6ZSwgc2F2ZWRDb21wb3NpdGVzKSB7XG4gICAgICB0aGlzLiRzY29wZSA9ICRzY29wZTtcbiAgICAgIHRoaXMuJHNhbml0aXplID0gJHNhbml0aXplO1xuICAgICAgdGhpcy50ZW1wbGF0ZVNydiA9IHRlbXBsYXRlU3J2O1xuICAgICAgdGhpcy5zdWJUYWJJbmRleCA9IDA7XG4gICAgICAvLyB0eXBlYWhlYWQgcmVxdWlyZXMgdGhpcyBmb3JtXG4gICAgICB0aGlzLnN1Z2dlc3RNZXRyaWNOYW1lcyA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIF8ubWFwKHRoaXMuJHNjb3BlLmN0cmwuc2VyaWVzLCBmdW5jdGlvbiAoc2VyaWVzKSB7XG4gICAgICAgICAgcmV0dXJuIHNlcmllcy5hbGlhcztcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5tZXRyaWNDb21wb3NpdGVzID0gc2F2ZWRDb21wb3NpdGVzO1xuICAgICAgLy8gdXBncmFkZSBpZiBubyBsYWJlbCBwcmVzZW50XG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tZXRyaWNDb21wb3NpdGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMubWV0cmljQ29tcG9zaXRlc1tpbmRleF0ubGFiZWwgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICB0aGlzLm1ldHJpY0NvbXBvc2l0ZXNbaW5kZXhdLmxhYmVsID0gXCJDT01QT1NJVEUgXCIgKyAoaW5kZXggKyAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGFkZE1ldHJpY0NvbXBvc2l0ZSgpIHtcbiAgICAgIGxldCBhQ29tcG9zaXRlID0gbmV3IE1ldHJpY0NvbXBvc2l0ZSgpO1xuICAgICAgYUNvbXBvc2l0ZS5sYWJlbCA9IFwiQ09NUE9TSVRFIFwiICsgKHRoaXMubWV0cmljQ29tcG9zaXRlcy5sZW5ndGggKyAxKTtcbiAgICAgIGFDb21wb3NpdGUuY29tcG9zaXRlTmFtZSA9IFwiXCI7XG4gICAgICBhQ29tcG9zaXRlLm1lbWJlcnMgPSBbe31dO1xuICAgICAgYUNvbXBvc2l0ZS5lbmFibGVkID0gdHJ1ZTtcbiAgICAgIGFDb21wb3NpdGUuY2xpY2tUaHJvdWdoID0gXCJcIjtcbiAgICAgIGFDb21wb3NpdGUuaGlkZU1lbWJlcnMgPSB0cnVlO1xuICAgICAgYUNvbXBvc2l0ZS5zaG93TmFtZSA9IHRydWU7XG4gICAgICBhQ29tcG9zaXRlLnNob3dWYWx1ZSA9IHRydWU7XG4gICAgICBhQ29tcG9zaXRlLmFuaW1hdGVNb2RlID0gXCJhbGxcIjtcbiAgICAgIGFDb21wb3NpdGUudGhyZXNob2xkTGV2ZWwgPSAwO1xuICAgICAgYUNvbXBvc2l0ZS5zYW5pdGl6ZVVSTEVuYWJsZWQgPSB0cnVlO1xuICAgICAgYUNvbXBvc2l0ZS5zYW5pdGl6ZWRVUkwgPSBcIlwiO1xuICAgICAgdGhpcy5tZXRyaWNDb21wb3NpdGVzLnB1c2goYUNvbXBvc2l0ZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTWV0cmljQ29tcG9zaXRlKGl0ZW0pIHtcbiAgICAgIC8vIGxvZGFzaCBfLndpdGhvdXQgY3JlYXRlcyBhIG5ldyBhcnJheSwgbmVlZCB0byByZWFzc2lnbiB0byB0aGUgcGFuZWwgd2hlcmUgaXQgd2lsbCBiZSBzYXZlZFxuICAgICAgdGhpcy5tZXRyaWNDb21wb3NpdGVzID0gXy53aXRob3V0KHRoaXMubWV0cmljQ29tcG9zaXRlcywgaXRlbSk7XG4gICAgICAvLyBmaXggdGhlIGxhYmVsc1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubWV0cmljQ29tcG9zaXRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdGhpcy5tZXRyaWNDb21wb3NpdGVzW2luZGV4XS5sYWJlbCA9IFwiQ09NUE9TSVRFIFwiICsgKGluZGV4ICsgMSk7XG4gICAgICB9XG4gICAgICAvLyByZWFzc2lnbiByZWZlcmVuY2UgaW4gcGFuZWxcbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucGFuZWwuc2F2ZWRDb21wb3NpdGVzID0gdGhpcy5tZXRyaWNDb21wb3NpdGVzO1xuICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgYWRkTWV0cmljVG9Db21wb3NpdGUoY29tcG9zaXRlKSB7XG4gICAgICBpZiAoY29tcG9zaXRlLm1lbWJlcnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb21wb3NpdGUubWVtYmVycyA9IFt7fV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wb3NpdGUubWVtYmVycy5wdXNoKHt9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuJHNjb3BlLmN0cmwucmVmcmVzaCgpO1xuICAgIH1cblxuICAgIHJlbW92ZU1ldHJpY0Zyb21Db21wb3NpdGUoY29tcG9zaXRlLCBtZXRyaWMpIHtcbiAgICAgIGNvbXBvc2l0ZS5tZW1iZXJzID0gXy53aXRob3V0KGNvbXBvc2l0ZS5tZW1iZXJzLCBtZXRyaWMpO1xuICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxuXG4gICAgbWF0Y2hDb21wb3NpdGUocGF0dGVybikgOiBudW1iZXIge1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubWV0cmljQ29tcG9zaXRlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgbGV0IGFDb21wb3NpdGUgPSB0aGlzLm1ldHJpY0NvbXBvc2l0ZXNbaW5kZXhdO1xuICAgICAgICB2YXIgcmVnZXggPSBrYm4uc3RyaW5nVG9Kc1JlZ2V4KGFDb21wb3NpdGUuY29tcG9zaXRlTmFtZSk7XG4gICAgICAgIHZhciBtYXRjaGVzID0gcGF0dGVybi5tYXRjaChyZWdleCk7XG4gICAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoID4gMCAmJiBhQ29tcG9zaXRlLmVuYWJsZWQpIHtcbiAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBhcHBseUNvbXBvc2l0ZXMoZGF0YSkge1xuICAgICAgbGV0IGZpbHRlcmVkTWV0cmljcyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG4gICAgICBsZXQgY2xvbmVkQ29tcG9zaXRlcyA9IG5ldyBBcnJheTxQb2x5c3RhdE1vZGVsPigpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1ldHJpY0NvbXBvc2l0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IG1hdGNoZWRNZXRyaWNzID0gbmV3IEFycmF5PG51bWJlcj4oKTtcbiAgICAgICAgbGV0IGFDb21wb3NpdGUgPSB0aGlzLm1ldHJpY0NvbXBvc2l0ZXNbaV07XG4gICAgICAgIGlmICghYUNvbXBvc2l0ZS5lbmFibGVkKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGN1cnJlbnRXb3JzdFNlcmllcyA9IG51bGw7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYUNvbXBvc2l0ZS5tZW1iZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgbGV0IGFNZXRyaWMgPSBhQ29tcG9zaXRlLm1lbWJlcnNbal07XG4gICAgICAgICAgLy8gbG9vayBmb3IgdGhlIG1hdGNoZXMgdG8gdGhlIHBhdHRlcm4gaW4gdGhlIGRhdGFcbiAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZGF0YS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIC8vIG1hdGNoIHJlZ2V4XG4gICAgICAgICAgICAvLyBzZXJpZXNuYW1lIG1heSBub3QgYmUgZGVmaW5lZCB5ZXQsIHNraXBcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYU1ldHJpYy5zZXJpZXNOYW1lID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHJlZ2V4ID0ga2JuLnN0cmluZ1RvSnNSZWdleChhTWV0cmljLnNlcmllc05hbWUpO1xuICAgICAgICAgICAgbGV0IG1hdGNoZXMgPSBkYXRhW2luZGV4XS5uYW1lLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBsZXQgc2VyaWVzSXRlbSA9IGRhdGFbaW5kZXhdO1xuICAgICAgICAgICAgICAvLyBrZWVwIGluZGV4IG9mIHRoZSBtYXRjaGVkIG1ldHJpY1xuICAgICAgICAgICAgICBtYXRjaGVkTWV0cmljcy5wdXNoKGluZGV4KTtcbiAgICAgICAgICAgICAgLy8gb25seSBoaWRlIGlmIHJlcXVlc3RlZFxuICAgICAgICAgICAgICBpZiAoYUNvbXBvc2l0ZS5oaWRlTWVtYmVycykge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkTWV0cmljcy5wdXNoKGluZGV4KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoYUNvbXBvc2l0ZS5jbGlja1Rocm91Z2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHNlcmllc0l0ZW0uY2xpY2tUaHJvdWdoID0gYUNvbXBvc2l0ZS5jbGlja1Rocm91Z2g7XG4gICAgICAgICAgICAgICAgc2VyaWVzSXRlbS5zYW5pdGl6ZWRVUkwgPSB0aGlzLiRzYW5pdGl6ZShhQ29tcG9zaXRlLmNsaWNrVGhyb3VnaCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoZWRNZXRyaWNzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5vdyBkZXRlcm1pbmUgdGhlIG1vc3QgdHJpZ2dlcmVkIHRocmVzaG9sZFxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IG1hdGNoZWRNZXRyaWNzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgbGV0IGl0ZW1JbmRleCA9IG1hdGNoZWRNZXRyaWNzW2tdO1xuICAgICAgICAgIGxldCBzZXJpZXNJdGVtID0gZGF0YVtpdGVtSW5kZXhdO1xuICAgICAgICAgIC8vIGNoZWNrIHRocmVzaG9sZHNcbiAgICAgICAgICBpZiAoY3VycmVudFdvcnN0U2VyaWVzID09PSBudWxsKSB7XG4gICAgICAgICAgICBjdXJyZW50V29yc3RTZXJpZXMgPSBzZXJpZXNJdGVtO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjdXJyZW50V29yc3RTZXJpZXMgPSBnZXRXb3JzdFNlcmllcyhcbiAgICAgICAgICAgICAgY3VycmVudFdvcnN0U2VyaWVzLFxuICAgICAgICAgICAgICBzZXJpZXNJdGVtLFxuICAgICAgICAgICAgICB0aGlzLiRzY29wZS5jdHJsLnBhbmVsLnBvbHlzdGF0LnBvbHlnb25HbG9iYWxGaWxsQ29sb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBQcmVmaXggdGhlIHZhbHVlRm9ybWF0dGVkIHdpdGggdGhlIGFjdHVhbCBtZXRyaWMgbmFtZVxuICAgICAgICBpZiAoY3VycmVudFdvcnN0U2VyaWVzICE9PSBudWxsKSB7XG4gICAgICAgICAgbGV0IGNsb25lID0gY3VycmVudFdvcnN0U2VyaWVzLnNoYWxsb3dDbG9uZSgpO1xuICAgICAgICAgIGNsb25lLm5hbWUgPSBhQ29tcG9zaXRlLmNvbXBvc2l0ZU5hbWU7XG4gICAgICAgICAgLy8gdG9vbHRpcC9sZWdlbmQgdXNlcyB0aGlzIHRvIGV4cGFuZCB3aGF0IHZhbHVlcyBhcmUgaW5zaWRlIHRoZSBjb21wb3NpdGVcbiAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbWF0Y2hlZE1ldHJpY3MubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgaXRlbUluZGV4ID0gbWF0Y2hlZE1ldHJpY3NbaW5kZXhdO1xuICAgICAgICAgICAgY2xvbmUubWVtYmVycy5wdXNoKGRhdGFbaXRlbUluZGV4XSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNsb25lLnRocmVzaG9sZExldmVsID0gY3VycmVudFdvcnN0U2VyaWVzLnRocmVzaG9sZExldmVsO1xuICAgICAgICAgIC8vIGN1cnJlbnRXb3JzdFNlcmllcy52YWx1ZUZvcm1hdHRlZCA9IGN1cnJlbnRXb3JzdFNlcmllc05hbWUgKyAnOiAnICsgY3VycmVudFdvcnN0U2VyaWVzLnZhbHVlRm9ybWF0dGVkO1xuICAgICAgICAgIC8vIG5vdyBwdXNoIHRoZSBjb21wb3NpdGUgaW50byBkYXRhXG4gICAgICAgICAgLy8gYWRkIHRoZSBjb21wb3NpdGUgc2V0aW5nIGZvciBzaG93aW5nIHRoZSBuYW1lL3ZhbHVlIHRvIHRoZSBuZXcgY2xvbmVkIG1vZGVsXG4gICAgICAgICAgY2xvbmUuc2hvd05hbWUgPSBhQ29tcG9zaXRlLnNob3dOYW1lO1xuICAgICAgICAgIGNsb25lLnNob3dWYWx1ZSA9IGFDb21wb3NpdGUuc2hvd1ZhbHVlO1xuICAgICAgICAgIGNsb25lLmFuaW1hdGVNb2RlID0gYUNvbXBvc2l0ZS5hbmltYXRlTW9kZTtcbiAgICAgICAgICAvLyBtYXJrIHRoaXMgc2VyaWVzIGFzIGEgY29tcHNpdGVcbiAgICAgICAgICBjbG9uZS5pc0NvbXBvc2l0ZSA9IHRydWU7XG4gICAgICAgICAgY2xvbmVkQ29tcG9zaXRlcy5wdXNoKGNsb25lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gbm93IG1lcmdlIHRoZSBjbG9uZWRDb21wb3NpdGVzIGludG8gZGF0YVxuICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZGF0YSwgY2xvbmVkQ29tcG9zaXRlcyk7XG4gICAgICAvLyBzb3J0IGJ5IHZhbHVlIGRlc2NlbmRpbmdcbiAgICAgIGZpbHRlcmVkTWV0cmljcy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBiIC0gYTsgfSk7XG4gICAgICAvLyBub3cgcmVtb3ZlIHRoZSBmaWx0ZXJlZCBtZXRyaWNzIGZyb20gZmluYWwgbGlzdFxuICAgICAgLy8gcmVtb3ZlIGZpbHRlcmVkIG1ldHJpY3MsIHVzZSBzcGxpY2UgaW4gcmV2ZXJzZSBvcmRlclxuICAgICAgZm9yIChsZXQgaSA9IGRhdGEubGVuZ3RoOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAoXy5pbmNsdWRlcyhmaWx0ZXJlZE1ldHJpY3MsIGkpKSB7XG4gICAgICAgICAgZGF0YS5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIG1ldHJpY05hbWVDaGFuZ2VkKGl0ZW0pIHtcbiAgICAgICAgLy8gVE9ETzogdmFsaWRhdGUgaXRlbSBpcyBhIHZhbGlkIHJlZ2V4XG4gICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICB0aGlzLiRzY29wZS5jdHJsLnJlZnJlc2goKTtcbiAgICB9XG5cbiAgICB0b2dnbGVIaWRlKGNvbXBvc2l0ZSkge1xuICAgICAgY29uc29sZS5sb2coXCJjb21wb3NpdGUgZW5hYmxlZCA9ICBcIiArIGNvbXBvc2l0ZS5lbmFibGVkKTtcbiAgICAgIGNvbXBvc2l0ZS5lbmFibGVkID0gIWNvbXBvc2l0ZS5lbmFibGVkO1xuICAgICAgdGhpcy4kc2NvcGUuY3RybC5yZWZyZXNoKCk7XG4gICAgfVxufVxuIl19