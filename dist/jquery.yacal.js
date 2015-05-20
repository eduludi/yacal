// Generated by CoffeeScript 1.9.2

/*
jQuery yacal Plugin v0.2.0
https://github.com/eduludi/jquery-yacal

Authors:
 - Eduardo Ludi @eduludi
 - Some s took from Pickaday: https://github.com/dbushell/Pikaday
   (David Bushell @dbushell and Ramiro Rikkert @RamRik)
 - isLeapYear: Matti Virkkunen (http://stackoverflow.com/a/4881951)
        
Released under the MIT license
 */
(function($, doc, win) {
  "use strict";
  var _name, _ph, changeMonth, getDaysInMonth, getWeek, inRange, isDate, isLeapYear, isToday, isWeekend, tag, zeroHour;
  _name = 'yacal';
  _ph = {
    d: '<#day#>',
    dt: '<#time#>',
    we: '<#weekend#>',
    t: '<#today#>',
    s: '<#selected#>',
    a: '<#active#>',
    w: '<#week#>',
    ws: '<#weekSelected#>',
    wt: '<#weekTime#>',
    wd: '<#weekday#>',
    wdnam: '<#weekdayName#>',
    wdnum: '<#weekdayNumber#>',
    mnam: '<#monthName#>',
    mnum: '<#monthNumber#>',
    md: '<#monthDays#>',
    y: '<#year#>',
    nav: '<#nav#>',
    prev: '<#prev#>',
    next: '<#next#>'
  };
  isDate = function(obj) {
    return /Date/.test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
  };
  isWeekend = function(date) {
    var ref;
    return (ref = date.getDay()) === 0 || ref === 6;
  };
  inRange = function(date, min, max) {
    var vmi, vmx;
    vmi = isDate(min);
    vmx = isDate(max);
    if (vmi && vmx) {
      return min <= date && date <= max;
    } else if (vmi) {
      return min <= date;
    } else if (vmx) {
      return date <= max;
    } else {
      return true;
    }
  };
  zeroHour = function(date) {
    return date.setHours(0, 0, 0, 0);
  };
  isToday = function(date) {
    return zeroHour(date) === zeroHour(new Date());
  };
  isLeapYear = function(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  };
  getDaysInMonth = function(year, month) {
    return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  };
  getWeek = function(date) {
    var onejan;
    onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  };
  changeMonth = function(date, amount) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
  };
  tag = function(name, classes, content, data) {
    return '<' + name + ' ' + (classes ? ' class="' + classes + '" ' : '') + (data ? 'data-' + data : '') + '>' + (content ? content + '</' + name + '>' : '');
  };
  $.fn.yacal = function(options) {
    return this.each(function(index) {
      var _d, _firstDay, _i18n, _maxDate, _minDate, _nearMonths, _s, _showWD, _tpl, isSelected, isSelectedWeek, opts, renderCalendar, renderDay, renderMonth, renderNav;
      _d = _s = null;
      _tpl = {};
      _i18n = {};
      _nearMonths = _showWD = _minDate = _maxDate = _firstDay = null;
      isSelected = function(date) {
        return zeroHour(_s) === zeroHour(date);
      };
      isSelectedWeek = function(wStart) {
        var wEnd;
        wEnd = new Date(wStart.getTime() + (((7 - wStart.getDay()) * 86400000) - 1));
        return inRange(_s, wStart, wEnd);
      };
      renderNav = function() {
        return _tpl.nav.replace(_ph.prev, _i18n.prev).replace(_ph.next, _i18n.next);
      };
      renderDay = function(date) {
        return _tpl.day.replace(_ph.d, date.getDate()).replace(_ph.dt, date.getTime()).replace(_ph.we, isWeekend(date) ? ' weekend' : '').replace(_ph.t, isToday(date) ? ' today' : '').replace(_ph.s, isSelected(date) ? ' selected' : '').replace(_ph.a, inRange(date, _minDate, _maxDate) ? ' active' : '').replace(_ph.wd, date.getDay());
      };
      renderMonth = function(date, nav) {
        var d, day, month, out, totalDays, wd, year;
        if (nav == null) {
          nav = false;
        }
        totalDays = getDaysInMonth(date.getYear(), date.getMonth());
        month = date.getMonth();
        year = date.getFullYear();
        out = '';
        d = 0;
        if (_showWD) {
          wd = 0;
          out += _tpl.weekOpen.replace(_ph.w, wd).replace(_ph.wt, '').replace(_ph.ws, '');
          while (wd <= 6) {
            out += _tpl.weekday.replace(_ph.wdnam, _i18n.weekdays[wd]).replace(_ph.wdnum, wd);
            wd++;
          }
          out += _tpl.weekClose;
        }
        while (d < totalDays) {
          day = new Date(year, month, d + 1);
          if (0 === d || 0 === day.getDay()) {
            out += _tpl.weekOpen.replace(_ph.w, getWeek(day)).replace(_ph.wt, day.getTime()).replace(_ph.ws, isSelectedWeek(day) ? ' selected' : '');
          }
          out += renderDay(day, _tpl.day);
          if (d === totalDays - 1 || day.getDay() === 6) {
            out += _tpl.weekClose;
          }
          d++;
        }
        return _tpl.month.replace(_ph.mnum, month).replace(_ph.mnam, _i18n.months[month]).replace(_ph.nav, nav ? renderNav() : '').replace(_ph.y, year).replace(_ph.md, out);
      };
      renderCalendar = function(element) {
        var nm, out, pm;
        out = '';
        if (_nearMonths) {
          pm = _nearMonths;
          while (pm > 0) {
            out += renderMonth(changeMonth(_d, -pm));
            pm--;
          }
        }
        out += renderMonth(_d, true);
        if (_nearMonths) {
          nm = 1;
          while (nm <= _nearMonths) {
            out += renderMonth(changeMonth(_d, +nm));
            nm++;
          }
        }
        $(element).html('');
        $(element).append($(_tpl.wrap).append(out));
        $(element).find('.yclPrev').on('click', function() {
          _d = changeMonth(_d, -1);
          return renderCalendar($(element));
        });
        return $(element).find('.yclNext').on('click', function() {
          _d = changeMonth(_d, +1);
          return renderCalendar($(element));
        });
      };
      opts = $.extend(true, {}, $.fn.yacal.defaults, options);
      if ($(this).data()) {
        opts = $.extend(true, {}, opts, $(this).data());
      }
      _d = _s = new Date(opts.date);
      _tpl = opts.tpl;
      _i18n = opts.i18n;
      _nearMonths = parseInt(opts.nearMonths);
      _showWD = !!opts.showWeekdays;
      if (opts.minDate) {
        _minDate = new Date(opts.minDate);
      }
      if (opts.maxDate) {
        _maxDate = new Date(opts.maxDate);
      }
      _firstDay = parseInt(opts.firstDay);
      return renderCalendar(this);
    });
  };
  $.fn.yacal.defaults = {
    date: new Date(),
    nearMonths: 0,
    showWeekdays: 1,
    minDate: null,
    maxDate: null,
    tpl: {
      day: tag('a', 'day day' + _ph.wd + '' + _ph.we + '' + _ph.t + '' + _ph.s + '' + _ph.a, _ph.d, 'time="' + _ph.dt + '"'),
      weekday: tag('i', 'wday wday' + _ph.wdnum, _ph.wdnam),
      weekOpen: tag('div', 'week week' + _ph.w + _ph.ws, null, 'time="' + _ph.wt + '"'),
      weekClose: '</div>',
      month: tag('div', 'month month' + _ph.mnum, _ph.nav + tag('h4', null, _ph.mnam + ' ' + _ph.y) + _ph.md),
      nav: tag('div', 'nav', tag('a', 'yclPrev', tag('span', null, _ph.prev)) + tag('a', 'yclNext', tag('span', null, _ph.next))),
      wrap: tag('div', 'wrap')
    },
    i18n: {
      weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
      prev: 'prev',
      next: 'next'
    }
  };
  $.fn.yacal.version = '0.1.1';
  return $('.' + _name).yacal();
})(jQuery, document, window);
