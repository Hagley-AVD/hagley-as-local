!function(t) {
    function e(t, e, n, o, r) {
        function i() {
            r && r(),
            l.handleHashOnLoad(),
            l.updateContextSummary()
        }
        function a() {
            o && o()
        }
        this.base_url = t,
        this.wrapper = e,
        this.elt = e.find(".infinite-record-container"),
        this.contextSummaryElt = e.siblings(".infinite-record-context"),
        this.container = e.closest(".feed-container"),
        this.recordCount = n;
        var l = this;
        this.initKeyboardNavigation(),
        this.populateWaypoints(a, i),
        this.initEventHandlers()
    }
    var n = "scroll::";
    e.prototype.populateWaypoints = function(t, e) {
        var n = this;
        t || (t = $.noop),
        e || (e = $.noop);
        var o = n.elt.find(".waypoint:not(.populated)");
        o.addClass("populated"),
        n.elt.attr("aria-busy", "true"),
        $(o).each(function(e, o) {
            var r = $(o).data("waypoint-number")
              , i = $(o).data("waypoint-size")
              , a = $(o).data("collection-size")
              , l = $(o).data("uris").split(";");
            $(o).addClass("loading").attr("tabindex", "0"),
            $.ajax(n.url_for("waypoints"), {
                method: "GET",
                data: {
                    urls: l,
                    number: r,
                    size: i,
                    collection_size: a
                },
                async: !0
            }).done(function(e) {
                $(o).html(e),
                $(o).removeClass("loading").removeAttr("tabindex"),
                t(),
                $(o).trigger("waypointloaded")
            })
        }),
        n.elt.removeAttr("aria-busy"),
        e()
    }
    ,
    e.prototype.url_for = function(t) {
        var e = this;
        return e.base_url + "/" + t
    }
    ,
    e.prototype.getClosestElement = function(t) {
        if (t && 1 == this.elt.find(".infinite-item:focus").length)
            return this.elt.find(".infinite-item:focus").closest(".infinite-record-record");
        var e = this.elt.find(".infinite-record-record")
          , n = this.findClosestElement(e);
        return $(e.get(n))
    }
    ,
    e.prototype.getCurrentContext = function(t) {
        var e = this.getClosestElement(t)
          , n = e.data("ancestors") || [];
        if (1 == n.length && $.inArray(e.data("level"), ["series", "collection"]) >= 0)
            return e.data("uri");
        if (n.length > 1)
            for (var o = 0; o < n.length; o++)
                if ($.inArray(n[o].level, ["series", "collection"]) >= 0)
                    return n[o].ref;
        return null
    }
    ,
    e.prototype.updateContextSummary = function(t) {
        var e = this.getCurrentContext(t);
        if (e) {
            var n = this.contextSummaryElt.find('.dropdown-menu a[data-uri="' + e + '"]');
            if (n.length > 0)
                return $("#scrollContext .current-record-title").html(n.html()),
                this.contextSummaryElt.find(".dropdown-menu a").removeAttr("aria-current"),
                n.attr("aria-current", "true"),
                void $("#scrollContext").attr("title", $("#scrollContext .current-record-title").text().trim())
        }
        $("#scrollContext .current-record-title").html($("#scrollContext").parent().find(".dropdown-menu a:first").html()),
        this.contextSummaryElt.find(".dropdown-menu a").removeAttr("aria-current"),
        this.contextSummaryElt.find(".dropdown-menu a:first").attr("aria-current", "true"),
        $("#scrollContext").attr("title", $("#scrollContext .current-record-title").text().trim())
    }
    ,
    e.prototype.scrollToRecord = function(t) {
        var e = $(".waypoint").first().data("waypoint-size")
          , n = Math.floor(t / e)
          , o = function(t) {
            $("#record-number-" + t + " > .infinite-item").focus()
        };
        $($(".waypoint")[n]).is(".populated") ? $($(".waypoint")[n]).is(".loading") ? ($($(".waypoint")[n]).focus(),
        $($(".waypoint")[n]).on("waypointloaded", function() {
            o(t)
        })) : o(t) : console.warn("Cannot scrollToRecord as waypoint not populated")
    }
    ,
    e.prototype.scrollToRecordForURI = function(t) {
        var e = this;
        if (t.indexOf("/resources/") > 0)
            l = 0;
        else {
            var n = e.wrapper.find('[data-uris*="' + t + ';"], [data-uris$="' + t + '"]');
            if (0 == n.length)
                return;
            var o = n.data("uris").split(";")
              , r = $.inArray(t, o) + 1
              , i = n.data("waypointNumber")
              , a = n.data("waypointSize")
              , l = i * a + r
        }
        e.scrollToRecord(l),
        e.updateHash(t)
    }
    ,
    e.prototype.updateHash = function(t) {
        history.replaceState(null, null, document.location.pathname + "#" + n + t)
    }
    ,
    e.prototype.handleHashOnLoad = function() {
        var t = this;
        if (location.hash && location.hash.startsWith("#" + n)) {
            var e = new RegExp("^#(" + n + ")")
              , o = location.hash.replace(e, "");
            setTimeout(function() {
                t.scrollToRecordForURI(o)
            })
        }
    }
    ,
    e.prototype.initEventHandlers = function() {
        var t = this;
        t.container.on("click", ".infinite-record-context .dropdown-menu a", function() {
            $("#scrollContext").dropdown("toggle"),
            t.scrollToRecordForURI($(this).data("uri"))
        }),
        t.container.on("focus", ".infinite-item", function() {
            var e = $(this);
            setTimeout(function() {
                t.updateHash(e.data("uri")),
                t.updateContextSummary(!0)
            })
        }),
        $(window).on("scroll", function() {
            window.scrollY > t.elt.offset().top ? (t.contextSummaryElt.addClass("fixed"),
            t.contextSummaryElt.find(".infinite-record-context-selector").css("width", t.elt.width() + "px").css("margin-left", t.elt.offset().left + "px"),
            t.contextSummaryElt.find(".infinite-record-context-resource").css("padding-left", t.elt.offset().left + "px")) : t.contextSummaryElt.removeClass("fixed").find(".infinite-record-context-selector").css("width", "auto").css("margin-left", 0),
            t.updateContextSummary()
        })
    }
    ,
    e.prototype.initKeyboardNavigation = function() {
        var t = this;
        t.elt.on("keydown", ".infinite-record-record", function(e) {
            var n = $(this).closest(".infinite-record-record")
              , o = n.find(" > .infinite-item").data("recordnumber")
              , r = 0
              , i = n.find(" > .infinite-item").data("collectionsize") - 1;
            if (34 == e.keyCode)
                o = Math.min(o + 1, i);
            else if (33 == e.keyCode)
                n.prev() && (o = Math.max(o - 1, r));
            else if (e.ctrlKey && 35 == e.keyCode)
                o = i;
            else {
                if (!e.ctrlKey || 36 != e.keyCode)
                    return !0;
                o = r
            }
            return e.preventDefault(),
            t.scrollToRecord(o),
            !1
        })
    }
    ,
    e.prototype.findClosestElement = function(t) {
        if (t.length <= 1)
            return 0;
        var e = (window.scrollY,
        t.first().offset().top,
        0)
          , n = t.length - 1
          , o = function(t) {
            return t.getBoundingClientRect().top
        };
        if (o(t[e]) <= 0 && o(t[n]) <= 0)
            return n;
        for (; e + 1 < n && o(t[e]) < 0 && o(t[n]) > 0; ) {
            var r = Math.floor((n - e) / 2) + e
              , i = t[r]
              , a = o(i);
            a > 0 ? n = r : a <= 0 && (e = r)
        }
        return Math.abs(o(t[e])) < Math.abs(o(t[n])) ? e : n
    }
    ,
    t.WaypointLoader = e
}(window);
