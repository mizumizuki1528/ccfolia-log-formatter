// CCFOLIA Log Parser

class CcfoliaParser {
  static parse(html, sourceName) {
    sourceName = sourceName || '';
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var paragraphs = doc.querySelectorAll('body > p');
    var entries = [];

    paragraphs.forEach(function(p, index) {
      var style = p.getAttribute('style') || '';
      var colorMatch = style.match(/color:\s*(#[0-9a-fA-F]{6})/);
      var color = colorMatch ? colorMatch[1] : '#888888';

      var spans = p.querySelectorAll('span');
      if (spans.length < 3) return;

      var tabRaw = spans[0].textContent.trim();
      var speaker = spans[1].textContent.trim();
      var contentHtml = spans[2].innerHTML.trim();
      var contentText = spans[2].textContent.trim();

      var tabMatch = tabRaw.match(/\[(.+?)\]/);
      var tab = tabMatch ? tabMatch[1] : tabRaw;

      // Detect if secret tab
      var isSecret = false;
      // Japanese: starts with 秘匿
      if (/^\u79d8\u533f/.test(tab)) {
        isSecret = true;
      }
      // English: secret tab name
      if (!isSecret && /^secret/i.test(tab)) {
        isSecret = true;
      }

      // Detect dice rolls
      var isDice = false;
      var diceResult = '';
      var diceMatch = contentText.match(/\((\d+D\d+.*?)\uff1e\s*(\d+)\s*\uff1e\s*(.+)/);
      if (diceMatch) {
        isDice = true;
        diceResult = diceMatch[3].trim();
      }

      entries.push({
        id: sourceName + '_' + index,
        index: index,
        tab: tab,
        speaker: speaker,
        contentHtml: contentHtml,
        contentText: contentText,
        color: color,
        source: sourceName,
        deleted: false,
        isSecret: isSecret,
        isDice: isDice,
        diceResult: diceResult,
        chapter: ''
      });
    });

    return entries;
  }

  static parseMultiple(files) {
    var allEntries = [];
    files.forEach(function(file) {
      var entries = CcfoliaParser.parse(file.html, file.name);
      allEntries = allEntries.concat(entries);
    });
    return allEntries;
  }

  static getTabs(entries) {
    var tabs = new Set();
    entries.forEach(function(e) { tabs.add(e.tab); });
    return Array.from(tabs);
  }

  static getSpeakers(entries) {
    var speakers = new Set();
    entries.forEach(function(e) { speakers.add(e.speaker); });
    return Array.from(speakers);
  }

  // Detect chapter markers from KP/narrator messages
  static detectChapters(entries, kpNames) {
    kpNames = kpNames || ['KP', 'GM', 'DM'];
    var chapters = [];
    var manualTitles = new Set();

    // Match: "N話 title" (Japanese) or "Chapter N: title" / "Episode N: title" (English)
    var chapterPatternJp = /^(\d+)\u8a71\s+(.+)/;
    var chapterPatternEn = /^(?:Chapter|Episode|Scene)\s+(\d+)[:.\s]+(.+)/i;
    // Also match: "第N話" pattern
    var chapterPatternJp2 = /^\u7b2c(\d+)\u8a71\s*(.*)/;

    // First pass: collect manual markers
    entries.forEach(function(e) {
      if (e.source === 'manual' && e.isChapterMarker && !e.deleted) {
        manualTitles.add(e.chapter);
      }
    });

    entries.forEach(function(e, i) {
      // Skip manually added markers (preserve them as-is)
      if (e.source === 'manual' && e.isChapterMarker) {
        if (!e.deleted) {
          chapters.push({ index: i, number: '', title: e.chapter });
        }
        return;
      }
      // Reset auto-detected markers before re-evaluating
      if (e.source !== 'manual') {
        e.isChapterMarker = false;
        e.chapter = '';
      }
      var isKP = kpNames.indexOf(e.speaker) !== -1;
      if (isKP) {
        var match = e.contentText.match(chapterPatternJp);
        var title = '';
        if (match) {
          title = match[1] + '\u8a71 ' + match[2];
        } else {
          match = e.contentText.match(chapterPatternJp2);
          if (match) {
            title = '\u7b2c' + match[1] + '\u8a71' + (match[2] ? ' ' + match[2] : '');
          } else {
            match = e.contentText.match(chapterPatternEn);
            if (match) {
              title = 'Chapter ' + match[1] + ': ' + match[2];
            }
          }
        }
        if (match && title) {
          // Skip if a manual marker with same/similar title already exists
          var isDuplicate = false;
          manualTitles.forEach(function(mt) {
            if (mt.indexOf(title) !== -1 || title.indexOf(mt) !== -1) {
              isDuplicate = true;
            }
          });
          if (!isDuplicate) {
            var chapter = { index: i, number: match[1], title: title };
            chapters.push(chapter);
            e.chapter = chapter.title;
            e.isChapterMarker = true;
          }
        }
      }
    });
    return chapters;
  }
}
