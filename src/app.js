// CCFOLIA Log Formatter - Main App

(function () {
  'use strict';

  var entries = [];
  var chapters = [];
  var activeTabs = new Set();
  var tabVisibility = {}; // tab name -> boolean (visible/hidden), default visible
  var searchQuery = '';
  var editingIndex = null;
  var dragSrcIndex = null;
  var kpNames = []; // selected KP/narrator names
  var speakerColors = {}; // speaker name -> color mapping
  var speakerIcons = {}; // speaker name -> icon data URL
  var secretTabColors = {}; // secret tab name -> color
  var infoTabColors = {}; // info tab name -> color
  var tabTypes = {}; // tab name -> 'main' | 'chat' | 'info' | 'secret' (manual override)
  var scenarioTitle = ''; // scenario title for header display and export filename
  var exportBgColor = '#f5f5f5'; // export page background color
  var speakerOutlines = {}; // speaker name -> 'auto' | 'white' | 'black' | 'none'
  var headerColor1 = ''; // export header gradient color 1 (empty = no custom header)
  var headerColor2 = ''; // export header gradient color 2
  var headerTextColor = '#ffffff'; // export header text color

  var fileArea = document.getElementById('file-area');
  var dropZone = document.getElementById('drop-zone');
  var fileInput = document.getElementById('file-input');
  var kpSelectArea = document.getElementById('kp-select-area');
  var kpSpeakerList = document.getElementById('kp-speaker-list');
  var kpConfirm = document.getElementById('kp-confirm');
  var kpSkip = document.getElementById('kp-skip');
  var kpReselect = document.getElementById('kp-reselect');
  var toolbar = document.getElementById('toolbar');
  var tabFilters = document.getElementById('tab-filters');
  var chapterNav = document.getElementById('chapter-nav');
  var searchInput = document.getElementById('search-input');
  var searchCount = document.getElementById('search-count');
  var logContainer = document.getElementById('log-container');
  var btnExport = document.getElementById('btn-export');
  var editModal = document.getElementById('edit-modal');
  var editSpeaker = document.getElementById('edit-speaker');
  var editText = document.getElementById('edit-text');
  var editColor = document.getElementById('edit-color');
  var editIsKp = document.getElementById('edit-is-kp');
  var editIconPreview = document.getElementById('edit-icon-preview');
  var editIconChange = document.getElementById('edit-icon-change');
  var editIconReset = document.getElementById('edit-icon-reset');
  var editIconFile = document.getElementById('edit-icon-file');
  var editSave = document.getElementById('edit-save');
  var editCancel = document.getElementById('edit-cancel');
  var chapterModal = document.getElementById('chapter-modal');
  var chapterTitleInput = document.getElementById('chapter-title-input');
  var chapterShortInput = document.getElementById('chapter-short-input');
  var chapterSave = document.getElementById('chapter-save');
  var chapterCancel = document.getElementById('chapter-cancel');
  var editingChapterEntry = null;
  var btnColors = document.getElementById('btn-colors');
  var colorPanel = document.getElementById('color-panel');
  var colorPanelClose = document.getElementById('color-panel-close');
  var colorList = document.getElementById('color-list');
  var btnTabs = document.getElementById('btn-tabs');
  var tabPanel = document.getElementById('tab-panel');
  var tabPanelClose = document.getElementById('tab-panel-close');
  var tabList = document.getElementById('tab-list');

  // Help & Changelog modals
  var btnHelp = document.getElementById('btn-help');
  var btnChangelog = document.getElementById('btn-changelog');
  var helpModal = document.getElementById('help-modal');
  var changelogModal = document.getElementById('changelog-modal');

  btnHelp.addEventListener('click', function() {
    helpModal.classList.remove('hidden');
  });
  document.getElementById('help-close').addEventListener('click', function() {
    helpModal.classList.add('hidden');
  });
  btnChangelog.addEventListener('click', function() {
    changelogModal.classList.remove('hidden');
  });
  document.getElementById('changelog-close').addEventListener('click', function() {
    changelogModal.classList.add('hidden');
  });

  // File Loading
  function handleFiles(fileList) {
    var files = Array.from(fileList).filter(function(f) {
      return f.name.endsWith('.html');
    });
    if (files.length === 0) return;

    var readers = files.map(function(file) {
      return new Promise(function(resolve) {
        var reader = new FileReader();
        reader.onload = function(e) {
          resolve({ name: file.name, html: e.target.result });
        };
        reader.readAsText(file, 'UTF-8');
      });
    });

    Promise.all(readers).then(function(results) {
      // Check if any file has embedded edit data
      var savedData = null;
      var savedFromFile = null;
      for (var i = 0; i < results.length; i++) {
        var scriptEndTag = '<' + '/script>';
        var re = new RegExp('<script type="application/json" id="ccfolia-data">([\\s\\S]*?)' + scriptEndTag);
        var match = results[i].html.match(re);
        if (match) {
          try {
            savedData = JSON.parse(match[1].replace(/<\\\/script>/gi, '<\/script>'));
            savedFromFile = results[i].name;
            break;
          } catch (err) {
            console.warn('Failed to parse embedded data:', err);
          }
        }
      }

      if (savedData && results.length === 1) {
        // Restore from saved data (only when single file with saved data)
        restoreFromSavedData(savedData);
        return;
      }

      // Normal CCFOLIA log parsing
      entries = CcfoliaParser.parseMultiple(results);
      // Generate default scenario title from first file name
      if (results.length > 0 && !scenarioTitle) {
        var name = results[0].name.replace(/\.html?$/i, '');
        // Remove [all], [main], [全部], etc.
        name = name.replace(/[\[【].*?[\]】]/g, '').trim();
        scenarioTitle = name + '_\u7DE8\u96C6\u6E08\u307F';
      }
      var titleInput = document.getElementById('scenario-title');
      if (titleInput) titleInput.value = scenarioTitle;
      showKpSelection();
    });
  }

  // Restore from saved (embedded) data
  function restoreFromSavedData(data) {
    scenarioTitle = data.scenarioTitle || '';
    kpNames = data.kpNames || [];
    speakerColors = data.speakerColors || {};
    speakerIcons = data.speakerIcons || {};
    secretTabColors = data.secretTabColors || {};
    infoTabColors = data.infoTabColors || {};
    tabTypes = data.tabTypes || {};
    tabVisibility = data.tabVisibility || {};
    exportBgColor = data.exportBgColor || '#f5f5f5';
    headerColor1 = data.headerColor1 || '';
    headerColor2 = data.headerColor2 || '';
    headerTextColor = data.headerTextColor || '#ffffff';
    speakerOutlines = data.speakerOutlines || {};
    entries = data.entries || [];
    chapters = CcfoliaParser.detectChapters(entries, kpNames);
    fileArea.classList.add('hidden');
    initUI();
  }

  fileInput.addEventListener('change', function(e) { handleFiles(e.target.files); });

  dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', function() { dropZone.classList.remove('dragover'); });
  dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });

  // KP Selection
  function showKpSelection() {
    fileArea.classList.add('hidden');
    kpSelectArea.classList.remove('hidden');

    var speakers = CcfoliaParser.getSpeakers(entries);
    kpSpeakerList.innerHTML = '';
    var selected = new Set();

    speakers.forEach(function(speaker) {
      var label = document.createElement('label');
      label.className = 'kp-option';

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = speaker;
      // Pre-select common KP names
      if (speaker === 'KP' || speaker === 'GM' || speaker === 'DM') {
        checkbox.checked = true;
        selected.add(speaker);
      }

      checkbox.addEventListener('change', function() {
        if (this.checked) {
          selected.add(this.value);
        } else {
          selected.delete(this.value);
        }
        kpConfirm.disabled = selected.size === 0;
      });

      var span = document.createElement('span');
      span.textContent = speaker;

      label.appendChild(checkbox);
      label.appendChild(span);
      kpSpeakerList.appendChild(label);
    });

    kpConfirm.disabled = selected.size === 0;

    kpConfirm.onclick = function() {
      kpNames = Array.from(selected);
      var titleInput = document.getElementById('scenario-title');
      if (titleInput) scenarioTitle = titleInput.value || scenarioTitle;
      finishSetup();
    };

    kpSkip.onclick = function() {
      kpNames = [];
      var titleInput = document.getElementById('scenario-title');
      if (titleInput) scenarioTitle = titleInput.value || scenarioTitle;
      finishSetup();
    };

    kpReselect.onclick = function() {
      // Reset state and go back to file selection
      entries = [];
      kpNames = [];
      kpSelectArea.classList.add('hidden');
      fileArea.classList.remove('hidden');
      fileInput.value = '';
    };
  }

  function finishSetup() {
    kpSelectArea.classList.add('hidden');

    // Mark KP entries
    entries.forEach(function(e) {
      e.isKP = kpNames.indexOf(e.speaker) !== -1;
      // Re-evaluate isSecret based on getTabType (allows user override)
      e.isSecret = isSecretTabType(e.tab);
    });

    chapters = CcfoliaParser.detectChapters(entries, kpNames);
    initUI();
  }

  // UI Init
  function initUI() {
    toolbar.classList.remove('hidden');
    logContainer.classList.remove('hidden');
    btnExport.disabled = false;

    // Update header title with scenario title
    if (scenarioTitle) {
      var h1 = document.querySelector('#header h1');
      if (h1) h1.textContent = scenarioTitle;
      document.title = scenarioTitle;
    }

    // Make title editable on click
    var headerH1 = document.querySelector('#header h1');
    var btnTitleEdit = document.getElementById('btn-title-edit');
    var titleModal = document.getElementById('title-modal');
    var titleInput = document.getElementById('title-input');
    var titleSave = document.getElementById('title-save');
    var titleCancel = document.getElementById('title-cancel');
    if (btnTitleEdit) btnTitleEdit.classList.remove('hidden');

    function openTitleEdit() {
      titleInput.value = scenarioTitle;
      titleModal.classList.remove('hidden');
      titleInput.focus();
    }

    if (headerH1 && !headerH1.dataset.editable) {
      headerH1.dataset.editable = 'true';
      headerH1.style.cursor = 'pointer';
      headerH1.title = headerH1.getAttribute('data-edit-hint') || 'Click to edit title';
      headerH1.addEventListener('click', openTitleEdit);
    }
    if (btnTitleEdit && !btnTitleEdit.dataset.bound) {
      btnTitleEdit.dataset.bound = 'true';
      btnTitleEdit.addEventListener('click', openTitleEdit);
    }
    titleSave.addEventListener('click', function() {
      var newTitle = titleInput.value.trim();
      if (newTitle) {
        scenarioTitle = newTitle;
        headerH1.textContent = scenarioTitle;
        document.title = scenarioTitle;
      }
      titleModal.classList.add('hidden');
    });
    titleCancel.addEventListener('click', function() {
      titleModal.classList.add('hidden');
    });

    // Restore color picker values
    if (bgColorInput) {
      bgColorInput.value = exportBgColor;
      logContainer.style.backgroundColor = exportBgColor;
    }
    if (hdrColor1Input && headerColor1) hdrColor1Input.value = headerColor1;
    if (hdrColor2Input && headerColor2) hdrColor2Input.value = headerColor2;
    if (hdrTextColorInput) hdrTextColorInput.value = headerTextColor;

    // Build speaker color map from first occurrence
    var speakers = CcfoliaParser.getSpeakers(entries);
    speakers.forEach(function(name) {
      if (!speakerColors[name]) {
        // Find first entry with this speaker to get default color
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].speaker === name) {
            speakerColors[name] = entries[i].color;
            break;
          }
        }
      }
    });

    var tabs = CcfoliaParser.getTabs(entries);
    activeTabs = new Set(tabs);

    // Initialize secret tab colors from PC participants
    tabs.forEach(function(tab) {
      if (/^\u79d8\u533f/.test(tab) && !secretTabColors[tab]) {
        // Find first non-KP speaker in this tab
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].tab === tab && !entries[i].isKP && !entries[i].deleted) {
            secretTabColors[tab] = entries[i].color;
            break;
          }
        }
        if (!secretTabColors[tab]) {
          secretTabColors[tab] = '#999999';
        }
      }
      // Info tabs - default yellow
      if (isInfoTab(tab) && !infoTabColors[tab]) {
        infoTabColors[tab] = '#ffc107';
      }
    });

    renderTabFilters(tabs);
    renderChapterNav();
    renderLog();
  }

  function renderTabFilters(tabs) {
    tabFilters.innerHTML = '';
    tabs.forEach(function(tab) {
      var btn = document.createElement('button');
      btn.className = 'tab-btn active';
      btn.textContent = tab;
      btn.dataset.tab = tab;
      btn.addEventListener('click', function() {
        if (activeTabs.has(tab)) {
          activeTabs.delete(tab);
          btn.classList.remove('active');
        } else {
          activeTabs.add(tab);
          btn.classList.add('active');
        }
        renderLog();
      });
      tabFilters.appendChild(btn);
    });
  }

  function renderChapterNav() {
    chapterNav.innerHTML = '';
    // Filter out deleted chapters
    var activeChapters = chapters.filter(function(ch) {
      // Find the corresponding entry to check if deleted
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isChapterMarker && entries[i].chapter === ch.title) {
          return !entries[i].deleted;
        }
      }
      return true;
    });

    if (activeChapters.length === 0) {
      chapterNav.classList.add('hidden');
      return;
    }
    chapterNav.classList.remove('hidden');

    var label = document.createElement('span');
    label.className = 'chapter-label';
    label.textContent = chapterNav.getAttribute('data-label') || 'Jump to:';
    chapterNav.appendChild(label);

    var select = document.createElement('select');
    select.className = 'chapter-select';

    var firstOpt = document.createElement('option');
    firstOpt.value = '';
    firstOpt.textContent = chapterNav.getAttribute('data-placeholder') || '-- Select chapter --';
    select.appendChild(firstOpt);

    activeChapters.forEach(function(ch, i) {
      var opt = document.createElement('option');
      opt.value = 'chapter-' + i;
      // Use short name if available
      var entry = entries.find(function(e) { return e.isChapterMarker && e.chapter === ch.title && !e.deleted; });
      opt.textContent = (entry && entry.chapterShort) ? entry.chapterShort : ch.title;
      select.appendChild(opt);
    });

    select.addEventListener('change', function(e) {
      if (!e.target.value) return;
      var target = document.getElementById(e.target.value);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      e.target.value = ''; // reset to placeholder
    });

    chapterNav.appendChild(select);
  }

  // Tab Settings Panel
  btnTabs.addEventListener('click', function() {
    tabPanel.classList.toggle('hidden');
    if (!tabPanel.classList.contains('hidden')) {
      renderTabPanel();
    }
  });

  tabPanelClose.addEventListener('click', function() {
    tabPanel.classList.add('hidden');
  });

  function renderTabPanel() {
    tabList.innerHTML = '';
    var tabs = CcfoliaParser.getTabs(entries);

    tabs.forEach(function(tab) {
      var row = document.createElement('div');
      row.className = 'tab-config-row';

      // Header: visibility checkbox + tab name
      var header = document.createElement('div');
      header.className = 'tab-config-header';

      var visCheckbox = document.createElement('input');
      visCheckbox.type = 'checkbox';
      visCheckbox.checked = tabVisibility[tab] !== false;
      visCheckbox.title = tabPanel.getAttribute('data-show-label') || 'Show';
      visCheckbox.addEventListener('change', (function(tabName) {
        return function(e) {
          tabVisibility[tabName] = e.target.checked;
          renderLog();
        };
      })(tab));

      var nameDiv = document.createElement('div');
      nameDiv.className = 'tab-config-name';
      nameDiv.textContent = tab;

      header.appendChild(visCheckbox);
      header.appendChild(nameDiv);
      row.appendChild(header);

      var controls = document.createElement('div');
      controls.className = 'tab-config-controls';

      // Type selector
      var typeSelect = document.createElement('select');
      typeSelect.className = 'tab-type-select';
      var types = [
        { value: 'main', label: tabPanel.getAttribute('data-type-main') || 'Main' },
        { value: 'chat', label: tabPanel.getAttribute('data-type-chat') || 'Chat' },
        { value: 'info', label: tabPanel.getAttribute('data-type-info') || 'Info' },
        { value: 'secret', label: tabPanel.getAttribute('data-type-secret') || 'Secret' }
      ];
      var currentType = getTabType(tab);
      types.forEach(function(t) {
        var opt = document.createElement('option');
        opt.value = t.value;
        opt.textContent = t.label;
        if (t.value === currentType) opt.selected = true;
        typeSelect.appendChild(opt);
      });
      typeSelect.addEventListener('change', (function(tabName) {
        return function(e) {
          tabTypes[tabName] = e.target.value;
          // Re-evaluate isSecret for entries
          entries.forEach(function(ent) {
            if (ent.tab === tabName) {
              ent.isSecret = isSecretTabType(tabName);
            }
          });
          // Initialize color if needed
          if (e.target.value === 'info' && !infoTabColors[tabName]) {
            infoTabColors[tabName] = '#ffc107';
          }
          if (e.target.value === 'secret' && !secretTabColors[tabName]) {
            for (var i = 0; i < entries.length; i++) {
              if (entries[i].tab === tabName && !entries[i].isKP) {
                secretTabColors[tabName] = entries[i].color;
                break;
              }
            }
            if (!secretTabColors[tabName]) secretTabColors[tabName] = '#999999';
          }
          renderTabPanel();
          renderLog();
        };
      })(tab));
      controls.appendChild(typeSelect);

      // Color picker (for info/secret types)
      if (currentType === 'info' || currentType === 'secret') {
        var colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.className = 'tab-color-input';
        var currentColor = currentType === 'info'
          ? (infoTabColors[tab] || '#ffc107')
          : (secretTabColors[tab] || '#999999');
        colorInput.value = currentColor;
        colorInput.addEventListener('input', (function(tabName, type) {
          return function(e) {
            if (type === 'info') {
              infoTabColors[tabName] = e.target.value;
            } else {
              secretTabColors[tabName] = e.target.value;
            }
            renderLog();
          };
        })(tab, currentType));
        controls.appendChild(colorInput);
      }

      row.appendChild(controls);
      tabList.appendChild(row);
    });
  }

  // Color Panel
  btnColors.addEventListener('click', function() {
    colorPanel.classList.toggle('hidden');
    if (!colorPanel.classList.contains('hidden')) {
      renderColorPanel();
    }
  });

  colorPanelClose.addEventListener('click', function() {
    colorPanel.classList.add('hidden');
  });

  function renderColorPanel() {
    colorList.innerHTML = '';

    // Count messages per speaker
    var speakerCounts = {};
    entries.forEach(function(e) {
      if (!e.deleted) {
        speakerCounts[e.speaker] = (speakerCounts[e.speaker] || 0) + 1;
      }
    });

    // Speaker colors section - sorted by message count (descending)
    var speakers = Object.keys(speakerColors);
    speakers.sort(function(a, b) {
      return (speakerCounts[b] || 0) - (speakerCounts[a] || 0);
    });

    speakers.forEach(function(name) {
      var row = document.createElement('div');
      row.className = 'color-row';

      // Row 1: Name (full width)
      var nameDiv = document.createElement('div');
      nameDiv.className = 'color-row-name';
      nameDiv.textContent = name;
      nameDiv.title = name;
      nameDiv.style.color = speakerColors[name];
      nameDiv.style.textShadow = getTextShadow(speakerColors[name], name);
      row.appendChild(nameDiv);

      // Row 2: Controls
      var controls = document.createElement('div');
      controls.className = 'color-row-controls';

      // Icon
      var iconWrap = document.createElement('div');
      iconWrap.className = 'icon-wrap';

      var iconImg = document.createElement('img');
      iconImg.className = 'speaker-icon-preview';
      if (speakerIcons[name]) {
        iconImg.src = speakerIcons[name];
      } else {
        iconImg.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="#ccc"/><text x="16" y="22" text-anchor="middle" font-size="14" fill="#666">?</text></svg>');
      }

      var iconInput = document.createElement('input');
      iconInput.type = 'file';
      iconInput.accept = 'image/*';
      iconInput.className = 'icon-file-input';
      iconInput.addEventListener('change', (function(speakerName, img) {
        return function(e) {
          var file = e.target.files[0];
          if (!file) return;
          var reader = new FileReader();
          reader.onload = function(ev) {
            // Resize to 128x128 to prevent huge embedded data
            resizeImage(ev.target.result, 128, function(resizedDataUrl) {
              speakerIcons[speakerName] = resizedDataUrl;
              img.src = resizedDataUrl;
              renderLog();
            });
          };
          reader.readAsDataURL(file);
        };
      })(name, iconImg));

      iconWrap.appendChild(iconImg);
      iconWrap.appendChild(iconInput);
      iconWrap.addEventListener('click', function() { iconInput.click(); });

      // Color
      var colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.value = speakerColors[name];
      colorInput.addEventListener('input', (function(speakerName) {
        return function(e) {
          var newColor = e.target.value;
          speakerColors[speakerName] = newColor;
          entries.forEach(function(ent) {
            if (ent.speaker === speakerName) {
              ent.color = newColor;
            }
          });
          renderColorPanel();
          renderLog();
        };
      })(name));

      // Message count badge
      var countBadge = document.createElement('span');
      countBadge.className = 'speaker-count-badge';
      countBadge.textContent = (speakerCounts[name] || 0) + '';

      // KP toggle
      var kpLabel = document.createElement('label');
      kpLabel.className = 'kp-toggle';
      kpLabel.title = colorPanel.getAttribute('data-kp-label') || 'KP';

      var kpCheckbox = document.createElement('input');
      kpCheckbox.type = 'checkbox';
      kpCheckbox.checked = kpNames.indexOf(name) !== -1;
      kpCheckbox.addEventListener('change', (function(speakerName) {
        return function(e) {
          if (e.target.checked) {
            if (kpNames.indexOf(speakerName) === -1) kpNames.push(speakerName);
          } else {
            kpNames = kpNames.filter(function(n) { return n !== speakerName; });
          }
          // Update entries' isKP flag
          entries.forEach(function(ent) {
            if (ent.speaker === speakerName) {
              ent.isKP = e.target.checked;
            }
          });
          chapters = CcfoliaParser.detectChapters(entries, kpNames);
          renderChapterNav();
          renderLog();
        };
      })(name));

      var kpText = document.createElement('span');
      kpText.textContent = colorPanel.getAttribute('data-kp-label') || 'KP';

      kpLabel.appendChild(kpCheckbox);
      kpLabel.appendChild(kpText);

      controls.appendChild(iconWrap);
      controls.appendChild(colorInput);
      controls.appendChild(countBadge);
      controls.appendChild(kpLabel);

      // Outline select
      var outlineSelect = document.createElement('select');
      outlineSelect.className = 'outline-select';
      var outlineOptions = [
        { value: 'auto', label: colorPanel.getAttribute('data-outline-auto') || 'Auto' },
        { value: 'none', label: colorPanel.getAttribute('data-outline-none') || 'None' },
        { value: 'black', label: colorPanel.getAttribute('data-outline-black') || 'Black' },
        { value: 'white', label: colorPanel.getAttribute('data-outline-white') || 'White' }
      ];
      var currentOutline = speakerOutlines[name] || 'auto';
      outlineOptions.forEach(function(opt) {
        var o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.label;
        if (opt.value === currentOutline) o.selected = true;
        outlineSelect.appendChild(o);
      });
      outlineSelect.addEventListener('change', (function(speakerName) {
        return function(e) {
          speakerOutlines[speakerName] = e.target.value;
          renderColorPanel();
          renderLog();
        };
      })(name));
      controls.appendChild(outlineSelect);

      row.appendChild(controls);
      colorList.appendChild(row);
    });
  }

  // Background color
  var bgColorInput = document.getElementById('bg-color-input');
  bgColorInput.addEventListener('input', function(e) {
    exportBgColor = e.target.value;
    document.getElementById('log-container').style.backgroundColor = exportBgColor;
    renderLog(); // re-render to update text shadows
  });

  // Header colors
  var hdrColor1Input = document.getElementById('hdr-color1');
  var hdrColor2Input = document.getElementById('hdr-color2');
  var hdrTextColorInput = document.getElementById('hdr-text-color');

  hdrColor1Input.addEventListener('input', function(e) { headerColor1 = e.target.value; });
  hdrColor2Input.addEventListener('input', function(e) { headerColor2 = e.target.value; });
  hdrTextColorInput.addEventListener('input', function(e) { headerTextColor = e.target.value; });

  // Search
  searchInput.addEventListener('input', function(e) {
    searchQuery = e.target.value.toLowerCase();
    renderLog();
  });

  // Render
  function renderLog() {
    var filtered = entries.filter(function(e) {
      if (e.deleted) return false;
      if (!activeTabs.has(e.tab)) return false;
      // tabVisibility (default: true)
      if (tabVisibility[e.tab] === false) return false;
      if (searchQuery) {
        var haystack = (e.speaker + ' ' + e.contentText).toLowerCase();
        if (haystack.indexOf(searchQuery) === -1) return false;
      }
      return true;
    });

    if (searchQuery) {
      searchCount.textContent = filtered.length + ' \u4EF6';
    } else {
      searchCount.textContent = '';
    }

    logContainer.innerHTML = '';
    var chapterIdx = 0;
    var currentSecretGroup = null; // track consecutive secret tab

    filtered.forEach(function(entry, idx) {
      // Chapter header
      if (entry.isChapterMarker) {
        var chHeader = document.createElement('div');
        chHeader.className = 'chapter-header';
        chHeader.id = 'chapter-' + chapterIdx;
        chHeader.innerHTML = '<h2>' + escapeHtml(entry.chapter) + '</h2>';
        if (entry.chapterShort) {
          chHeader.innerHTML += '<span class="chapter-short">' + escapeHtml(entry.chapterShort) + '</span>';
        }
        chHeader.innerHTML += '<hr>';

        var chActions = document.createElement('div');
        chActions.className = 'chapter-actions';

        // Edit button
        var chEdit = document.createElement('button');
        chEdit.className = 'chapter-edit';
        chEdit.textContent = '\u270F';
        chEdit.title = 'Edit chapter';
        chEdit.addEventListener('click', (function(ent) {
          return function() { editChapter(ent); };
        })(entry));

        // Delete button
        var chDel = document.createElement('button');
        chDel.className = 'btn-delete chapter-del';
        chDel.textContent = '\u2716';
        chDel.title = 'Delete chapter';
        chDel.addEventListener('click', (function(ent) {
          return function() {
            if (confirm('\u3053\u306E\u8A71\u533A\u5207\u308A\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F')) {
              ent.deleted = true;
              chapters = CcfoliaParser.detectChapters(entries, kpNames);
              renderChapterNav();
              renderLog();
            }
          };
        })(entry));

        chActions.appendChild(chEdit);
        chActions.appendChild(chDel);
        chHeader.appendChild(chActions);
        logContainer.appendChild(chHeader);
        chapterIdx++;
        return; // skip rendering as regular entry
      }

      // Determine if this is part of a secret group
      var nextEntry = filtered[idx + 1];
      var prevEntry = filtered[idx - 1];
      var isSecretGroupStart = entry.isSecret && (!prevEntry || !prevEntry.isSecret || prevEntry.tab !== entry.tab);
      var isSecretGroupEnd = entry.isSecret && (!nextEntry || !nextEntry.isSecret || nextEntry.tab !== entry.tab);
      var isSecretGroupMiddle = entry.isSecret && !isSecretGroupStart && !isSecretGroupEnd;
      var isInfo = isInfoTab(entry.tab);

      // Create secret group wrapper if starting
      if (isSecretGroupStart) {
        currentSecretGroup = document.createElement('div');
        currentSecretGroup.className = 'secret-group';
        var secretBgColor = getSecretTabColor(entry.tab);
        var secretBorderColor = getSecretTabBorderColor(entry.tab);
        currentSecretGroup.style.backgroundColor = secretBgColor;
        currentSecretGroup.style.borderLeft = '3px dashed ' + secretBorderColor;
        logContainer.appendChild(currentSecretGroup);
      }

      var row = document.createElement('div');
      row.className = 'log-entry';
      if (entry.isSecret) row.className += ' secret';
      if (entry.isKP && !entry.isSecret) row.className += ' narration';
      if (isInfo) row.className += ' info-note';
      row.dataset.index = entry.index;
      row.draggable = true;
      row.style.borderLeftColor = entry.isSecret ? 'transparent' : entry.color;

      // Apply info tab color
      if (isInfo) {
        var infoColor = infoTabColors[entry.tab] || '#ffc107';
        row.style.borderLeftColor = infoColor;
        row.style.background = hexToRgba(infoColor, 0.1);
        row.style.borderColor = hexToRgba(infoColor, 0.4);
      }

      // Content with dice highlighting
      var displayContent = entry.contentHtml;
      if (entry.isDice) {
        displayContent = applyDiceHighlight(displayContent);
      }

      if (searchQuery) {
        // Highlight while preserving HTML structure (incl. <br>)
        // Split on tags and only modify text portions
        displayContent = displayContent.replace(
          /(<[^>]+>)|([^<]+)/g,
          function(match, tag, text) {
            if (tag) return tag;
            var regex = new RegExp('(' + escapeRegex(searchQuery) + ')', 'gi');
            return text.replace(regex, '<mark>$1</mark>');
          }
        );
      }

      var metaDiv = document.createElement('div');
      metaDiv.className = 'entry-meta';

      if (entry.overrideIcon || speakerIcons[entry.speaker]) {
        var icon = document.createElement('img');
        icon.className = 'entry-icon';
        icon.src = entry.overrideIcon || speakerIcons[entry.speaker];
        metaDiv.appendChild(icon);
      }

      var speakerSpan = document.createElement('span');
      speakerSpan.className = 'entry-speaker';
      speakerSpan.style.color = entry.color;
      speakerSpan.style.textShadow = getTextShadow(entry.color, entry.speaker);
      speakerSpan.textContent = entry.speaker;

      var tabSpan = document.createElement('span');
      tabSpan.className = 'entry-tab';
      if (entry.isSecret) {
        tabSpan.textContent = '[' + entry.tab + ']';
      } else if (isInfo) {
        tabSpan.textContent = '\uD83D\uDCCB ' + entry.tab; // 📋
      } else if (!isMainTab(entry.tab)) {
        // Show tab name except for main (main is the default)
        tabSpan.textContent = '[' + entry.tab + ']';
      }

      // For info note: tab label first, then speaker as title
      if (isInfo) {
        metaDiv.appendChild(tabSpan);
        metaDiv.appendChild(speakerSpan);
      } else {
        metaDiv.appendChild(speakerSpan);
        metaDiv.appendChild(tabSpan);
      }

      var contentDiv = document.createElement('div');
      contentDiv.className = 'entry-content';
      contentDiv.innerHTML = displayContent;

      var actionsDiv = document.createElement('div');
      actionsDiv.className = 'entry-actions';

      var btnEdit = document.createElement('button');
      btnEdit.className = 'btn-edit';
      btnEdit.textContent = '\u270F';
      btnEdit.title = 'Edit';
      btnEdit.addEventListener('click', (function(ent) {
        return function() { openEdit(ent); };
      })(entry));

      var btnDel = document.createElement('button');
      btnDel.className = 'btn-delete';
      btnDel.textContent = '\u2716';
      btnDel.title = 'Delete';
      btnDel.addEventListener('click', (function(ent) {
        return function() { deleteEntry(ent); };
      })(entry));

      var btnAddChapter = document.createElement('button');
      btnAddChapter.className = 'btn-add-chapter';
      btnAddChapter.textContent = '\uD83D\uDCD6'; // book icon
      btnAddChapter.title = 'Add chapter break';
      btnAddChapter.addEventListener('click', (function(ent) {
        return function() { addChapterBreak(ent); };
      })(entry));

      actionsDiv.appendChild(btnEdit);
      actionsDiv.appendChild(btnAddChapter);
      actionsDiv.appendChild(btnDel);

      row.appendChild(metaDiv);
      row.appendChild(contentDiv);
      row.appendChild(actionsDiv);

      // Drag and drop
      row.addEventListener('dragstart', (function(ent) {
        return function(e) {
          dragSrcIndex = entries.indexOf(ent);
          e.dataTransfer.effectAllowed = 'move';
          row.classList.add('dragging');
        };
      })(entry));
      row.addEventListener('dragend', function() { row.classList.remove('dragging'); });
      row.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        row.classList.add('drag-over');
      });
      row.addEventListener('dragleave', function() { row.classList.remove('drag-over'); });
      row.addEventListener('drop', (function(ent) {
        return function(e) {
          e.preventDefault();
          row.classList.remove('drag-over');
          var targetIndex = entries.indexOf(ent);
          if (dragSrcIndex !== null && dragSrcIndex !== targetIndex) {
            var moved = entries.splice(dragSrcIndex, 1)[0];
            entries.splice(targetIndex, 0, moved);
            renderLog();
          }
        };
      })(entry));

      // Append to secret group or main container
      if (entry.isSecret && currentSecretGroup) {
        currentSecretGroup.appendChild(row);
      } else {
        logContainer.appendChild(row);
      }

      // Close secret group if ending
      if (isSecretGroupEnd) {
        currentSecretGroup = null;
      }
    });
  }

  // Edit
  function openEdit(entry) {
    editingIndex = entries.indexOf(entry);
    var tabNameEl = document.getElementById('edit-tab-name');
    if (tabNameEl) tabNameEl.textContent = '[' + entry.tab + ']';
    editSpeaker.value = entry.speaker;
    // Convert <br> back to newlines for editing
    var textForEdit = entry.contentHtml
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ''); // strip other tags
    // Decode HTML entities
    var tmp = document.createElement('div');
    tmp.innerHTML = textForEdit;
    editText.value = tmp.textContent;
    editColor.value = entry.color;
    editIsKp.checked = entry.isKP;
    // Icon preview
    var iconSrc = entry.overrideIcon || speakerIcons[entry.speaker] || '';
    if (iconSrc) {
      editIconPreview.src = iconSrc;
      editIconPreview.style.display = 'block';
    } else {
      editIconPreview.src = '';
      editIconPreview.style.display = 'none';
    }
    editModal.classList.remove('hidden');
  }

  // Edit icon change/reset
  editIconChange.addEventListener('click', function() {
    editIconFile.click();
  });

  editIconFile.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      resizeImage(ev.target.result, 128, function(resized) {
        editIconPreview.src = resized;
        editIconPreview.style.display = 'block';
        editIconPreview.dataset.changed = 'true';
        editIconPreview.dataset.newIcon = resized;
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  editIconReset.addEventListener('click', function() {
    editIconPreview.dataset.changed = 'reset';
    editIconPreview.dataset.newIcon = '';
    if (editingIndex !== null) {
      var entry = entries[editingIndex];
      var defaultIcon = speakerIcons[entry.speaker] || '';
      if (defaultIcon) {
        editIconPreview.src = defaultIcon;
        editIconPreview.style.display = 'block';
      } else {
        editIconPreview.src = '';
        editIconPreview.style.display = 'none';
      }
    }
  });

  editSave.addEventListener('click', function() {
    if (editingIndex === null) return;
    var entry = entries[editingIndex];
    entry.speaker = editSpeaker.value;
    entry.contentText = editText.value;
    entry.contentHtml = escapeHtml(editText.value).replace(/\n/g, '<br>');
    entry.color = editColor.value;
    entry.isKP = editIsKp.checked;
    // Save override icon
    if (editIconPreview.dataset.changed === 'true') {
      entry.overrideIcon = editIconPreview.dataset.newIcon;
    } else if (editIconPreview.dataset.changed === 'reset') {
      delete entry.overrideIcon;
    }
    editIconPreview.dataset.changed = '';
    editIconPreview.dataset.newIcon = '';
    editModal.classList.add('hidden');
    editingIndex = null;
    renderLog();
  });

  editCancel.addEventListener('click', function() {
    editModal.classList.add('hidden');
    editingIndex = null;
  });

  // Delete
  function deleteEntry(entry) {
    if (confirm('\u300C' + entry.speaker + '\u300D\u306E\u767A\u8A00\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F')) {
      entry.deleted = true;
      renderLog();
    }
  }

  // Add chapter break before this entry
  function addChapterBreak(entry) {
    editingChapterEntry = null; // null means "new chapter"
    chapterTitleInput.value = '';
    chapterShortInput.value = '';
    chapterModal.dataset.insertBefore = entries.indexOf(entry);
    chapterModal.classList.remove('hidden');
  }

  // Edit chapter title and short name
  function editChapter(entry) {
    editingChapterEntry = entry;
    chapterTitleInput.value = entry.chapter;
    chapterShortInput.value = entry.chapterShort || '';
    chapterModal.classList.remove('hidden');
  }

  chapterSave.addEventListener('click', function() {
    var newTitle = chapterTitleInput.value.trim();
    if (!newTitle) return;
    var newShort = chapterShortInput.value.trim();

    if (editingChapterEntry) {
      // Editing existing chapter
      editingChapterEntry.chapter = newTitle;
      editingChapterEntry.chapterShort = newShort;
      editingChapterEntry.contentText = newTitle;
      editingChapterEntry.contentHtml = escapeHtml(newTitle);
    } else {
      // Adding new chapter
      var idx = parseInt(chapterModal.dataset.insertBefore, 10);
      if (isNaN(idx) || idx < 0) idx = 0;
      var refEntry = entries[idx];

      var marker = {
        id: 'manual_chapter_' + Date.now(),
        index: -1,
        tab: refEntry ? refEntry.tab : 'main',
        speaker: kpNames[0] || 'KP',
        contentHtml: escapeHtml(newTitle),
        contentText: newTitle,
        color: '#888888',
        source: 'manual',
        deleted: false,
        isSecret: false,
        isDice: false,
        diceResult: '',
        chapter: newTitle,
        chapterShort: newShort,
        isChapterMarker: true,
        isKP: true
      };

      entries.splice(idx, 0, marker);
    }

    chapterModal.classList.add('hidden');
    editingChapterEntry = null;
    delete chapterModal.dataset.insertBefore;
    chapters = CcfoliaParser.detectChapters(entries, kpNames);
    renderChapterNav();
    renderLog();
  });

  chapterCancel.addEventListener('click', function() {
    chapterModal.classList.add('hidden');
    editingChapterEntry = null;
  });

  // Export
  btnExport.addEventListener('click', function() {
    var visible = entries.filter(function(e) {
      return !e.deleted && activeTabs.has(e.tab) && tabVisibility[e.tab] !== false;
    });

    // Rebuild chapter list from visible entries only (excludes deleted)
    var visibleChapters = [];
    visible.forEach(function(e) {
      if (e.isChapterMarker) {
        visibleChapters.push({ title: e.chapter, short: e.chapterShort || '' });
      }
    });

    // Helper: get secret tab background color from PC participants
    function getSecretBgColor(tabName) {
      var color = secretTabColors[tabName];
      if (color) return hexToRgba(color, 0.08);
      return 'rgba(150,150,150,0.08)';
    }

    function getSecretBorderColor(tabName) {
      return secretTabColors[tabName] || '#999';
    }

    var html = '<!DOCTYPE html>\n<html lang="ja">\n<head>\n<meta charset="UTF-8">\n';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n';
    html += '<title>' + escapeHtml(scenarioTitle || 'CCFOLIA Formatted Log') + '</title>\n';
    html += '<style>\n';
    html += '* { box-sizing: border-box; margin: 0; padding: 0; }\n';
    html += 'body { font-family: "Segoe UI", "Hiragino Sans", sans-serif; background: ' + exportBgColor + '; padding: 20px; }\n';
    // Determine text colors based on background brightness
    var bgLum = getLuminance(exportBgColor);
    var textColor = bgLum > 0.5 ? '#444' : '#ddd';
    var mutedColor = bgLum > 0.5 ? '#999' : '#aaa';
    var headingColor = bgLum > 0.5 ? '#555' : '#ccc';
    var hrColor = bgLum > 0.5 ? '#ddd' : '#444';
    var bubbleBg = bgLum > 0.5 ? '#fff' : '#2a2a2a';
    var bubbleShadow = bgLum > 0.5 ? '0 1px 3px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.3)';
    var noteTextColor = bgLum > 0.5 ? '#666' : '#bbb';

    html += '.container { max-width: 1000px; margin: 0 auto; overflow: hidden; padding: 0 12px; }\n';
    html += '.main-col { width: 100%; }\n';
    html += '.main-entry { max-width: 700px; clear: left; margin-bottom: 4px; }\n';
    html += '.secret-entry { padding: 8px 14px; }\n';
    html += '.chat-block { float: right; clear: right; width: 280px; margin: 0 0 6px 16px; }\n';
    // Responsive
    html += '@media (max-width: 1000px) { .chat-block { width: 240px; } }\n';
    html += '@media (max-width: 860px) { .chat-block { width: 200px; } }\n';
    html += '@media (max-width: 760px) { .chat-block { float: none; width: 100%; max-width: 700px; margin: 8px 0; padding: 8px; background: ' + (bgLum > 0.5 ? '#f0f0f0' : '#333') + '; border-radius: 6px; } }\n';
    html += '@media (max-width: 720px) { .main-entry { max-width: 100%; } }\n';
    // Main entries
    html += '.msg { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; }\n';
    html += '.msg-icon { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }\n';
    html += '.msg-body { flex: 1; }\n';
    html += '.msg-name { font-weight: 600; font-size: 0.85rem; margin-bottom: 2px; }\n';
    html += '.msg-text { background: ' + bubbleBg + '; border-radius: 12px; padding: 10px 14px; font-size: 0.9rem; line-height: 1.6; box-shadow: ' + bubbleShadow + '; color: ' + textColor + '; }\n';
    // PC Secret - rounded bubble + colored bg + dashed border
    html += '.msg-secret { border: 1px dashed; box-shadow: none; }\n';
    html += '.secret-label { font-size: 0.75rem; opacity: 0.7; }\n';
    // KP narration style - full width, no bubble
    html += '.narration { margin: 8px 0 12px; padding: 12px 0; }\n';
    html += '.narration .narr-name { font-size: 0.75rem; color: ' + mutedColor + '; margin-bottom: 4px; }\n';
    html += '.narration .narr-text { font-size: 0.9rem; line-height: 1.8; color: ' + textColor + '; }\n';
    // KP secret narration
    html += '.narration-secret { border-left: 3px dashed; padding-left: 17px; border-radius: 0; }\n';
    // Info/Note style - card with title (adapts to background)
    var infoBgBase = bgLum > 0.5 ? '#fffde7' : '#2a2816';
    var infoBorderBase = bgLum > 0.5 ? '#ffe082' : '#5a4a1a';
    var infoTitleColor = bgLum > 0.5 ? '#c79100' : '#ffc107';
    var infoBodyColor = bgLum > 0.5 ? '#555' : '#ccc';
    html += '.info-note { background: ' + infoBgBase + '; border: 1px solid ' + infoBorderBase + '; border-left: 5px solid #ffc107; border-radius: 4px; padding: 14px 18px; margin: 12px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }\n';
    html += '.info-note .note-tab { font-size: 0.7rem; color: ' + mutedColor + '; margin-bottom: 2px; }\n';
    html += '.info-note .note-title { font-size: 1rem; font-weight: 700; color: ' + infoTitleColor + '; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid rgba(255, 193, 7, 0.3); }\n';
    html += '.info-note .note-body { font-size: 0.9rem; line-height: 1.8; color: ' + infoBodyColor + '; }\n';
    // Side notes - simple, no background
    html += '.note { font-size: 0.8rem; padding: 4px 0 4px 10px; border-left: 2px solid #ccc; margin-bottom: 6px; }\n';
    html += '.note-speaker { font-weight: 600; font-size: 0.75rem; margin-bottom: 2px; }\n';
    html += '.note-text { line-height: 1.5; color: ' + noteTextColor + '; }\n';
    // Chapter
    html += 'h2 { margin: 32px 0 16px; color: ' + headingColor + '; font-size: 1.1rem; }\n';
    html += '.ch-hr { border: none; border-top: 1px solid ' + hrColor + '; margin-bottom: 16px; }\n';
    // Export Header
    var hdrBg = '';
    if (headerColor1 && headerColor2) {
      hdrBg = 'linear-gradient(to bottom, ' + headerColor1 + ', ' + headerColor2 + ')';
    } else if (headerColor1) {
      hdrBg = headerColor1;
    } else {
      hdrBg = bgLum > 0.5 ? '#fff' : '#1a1a1a';
    }
    var hdrTextCol = headerColor1 ? headerTextColor : headingColor;
    var hdrLinkCol = headerColor1 ? headerTextColor : (bgLum > 0.5 ? '#4a90d9' : '#6db3f8');
    var hdrLinkBg = headerColor1 ? 'rgba(255,255,255,0.15)' : (bgLum > 0.5 ? '#f0f4f8' : '#333');
    var hdrLinkBorder = headerColor1 ? 'rgba(255,255,255,0.3)' : (bgLum > 0.5 ? '#dde4ec' : '#444');

    html += '.export-header { position: sticky; top: 0; z-index: 100; background: ' + hdrBg + '; padding: 12px 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); margin-bottom: 20px; }\n';
    html += '.export-title { font-size: 1.1rem; font-weight: 600; color: ' + hdrTextCol + '; margin-bottom: 8px; }\n';
    html += '.chapter-links { display: flex; flex-wrap: wrap; gap: 8px; }\n';
    html += '.chapter-links a { display: inline-block; padding: 4px 10px; background: ' + hdrLinkBg + '; border-radius: 4px; color: ' + hdrLinkCol + '; text-decoration: none; font-size: 0.85rem; border: 1px solid ' + hdrLinkBorder + '; }\n';
    html += '.chapter-links a:active { background: rgba(255,255,255,0.3); }\n';
    html += '@media (max-width: 600px) { .export-header { padding: 10px 12px; } .export-title { font-size: 1rem; } .chapter-links a { font-size: 0.8rem; padding: 3px 8px; } }\n';
    // Scroll offset for sticky header (account for safe area on iPhone)
    html += 'h2[id] { scroll-margin-top: calc(140px + env(safe-area-inset-top, 0px)); }\n';
    html += '@media (max-width: 600px) { h2[id] { scroll-margin-top: calc(160px + env(safe-area-inset-top, 0px)); } }\n';
    // Safe area for sticky header
    html += '.export-header { padding-top: calc(12px + env(safe-area-inset-top, 0px)); }\n';
    html += '.msg-text, .narration .narr-text, .note-text, .info-note .note-body { word-break: break-word; overflow-wrap: break-word; }\n';
    // Dice
    html += '.dice-result { font-weight: bold; }\n';
    html += '.dice-result.success { color: #00bfff; }\n';
    html += '.dice-result.failure { color: #ff4444; }\n';
    html += '</style>\n</head>\n<body>\n';

    // Export header with scenario title and chapter nav (no JS required)
    html += '<header class="export-header">\n';
    if (scenarioTitle) {
      html += '<h1 class="export-title">' + escapeHtml(scenarioTitle) + '</h1>\n';
    }
    if (visibleChapters.length > 0) {
      html += '<nav class="chapter-links">\n';
      visibleChapters.forEach(function(ch, i) {
        var displayName = ch.short || ch.title;
        html += '<a href="#ch' + i + '">' + escapeHtml(displayName) + '</a>\n';
      });
      html += '</nav>\n';
    }
    html += '</header>\n';

    // Group entries: main with their following chat notes
    var groupedMain = []; // [{entry: mainEntry, chats: [chatEntry, ...]}]
    var pendingChats = [];

    visible.forEach(function(e) {
      var isChat = isChatTab(e.tab);
      if (isChat) {
        pendingChats.push(e);
      } else {
        groupedMain.push({ entry: e, chats: pendingChats });
        pendingChats = [];
      }
    });
    // Handle trailing chats (no main after them) - attach to last main
    if (pendingChats.length > 0 && groupedMain.length > 0) {
      groupedMain[groupedMain.length - 1].chats =
        groupedMain[groupedMain.length - 1].chats.concat(pendingChats);
    }

    html += '<div class="container">\n';

    // Main column
    html += '<div class="main-col">\n';
    var chIdx = 0;

    groupedMain.forEach(function(group, idx) {
      var e = group.entry;
      var chats = group.chats;
      var eContent = e.isDice ? applyDiceHighlight(e.contentHtml) : e.contentHtml;
      var nextE = idx + 1 < groupedMain.length ? groupedMain[idx + 1].entry : null;
      var prevE = idx > 0 ? groupedMain[idx - 1].entry : null;

      // Determine if this entry is part of a continuous secret block (same tab as adjacent)
      var sameTabAsPrev = e.isSecret && prevE && prevE.isSecret && prevE.tab === e.tab;
      var sameTabAsNext = e.isSecret && nextE && nextE.isSecret && nextE.tab === e.tab;

      if (e.isChapterMarker) {
        html += '<h2 id="ch' + chIdx + '" style="clear:both;">' + escapeHtml(e.chapter) + '</h2><hr class="ch-hr">\n';
        chIdx++;
        // Don't render chapter markers as regular entries (skip the rest)
        return;
      }

      // Output chat block FIRST so it floats right and main content flows around it
      if (chats.length > 0) {
        html += '<div class="chat-block">\n';
        chats.forEach(function(c) {
          html += '  <div class="note" style="border-left-color:' + c.color + ';">\n';
          html += '    <div class="note-speaker" style="color:' + c.color + '; text-shadow:' + getTextShadow(c.color, c.speaker) + ';">' + escapeHtml(c.speaker) + '</div>\n';
          html += '    <div class="note-text">' + (c.isDice ? applyDiceHighlight(c.contentHtml) : c.contentHtml) + '</div>\n';
          html += '  </div>\n';
        });
        html += '</div>\n';
      }

      // Main entry
      var entryClass = 'main-entry';
      var entryStyle = '';
      if (e.isSecret) {
        var sBg = getSecretBgColor(e.tab);
        var sBorder = getSecretBorderColor(e.tab);
        entryClass += ' secret-entry';
        entryStyle = ' style="background:' + sBg + '; border-left: 3px dashed ' + sBorder + ';';
        if (!sameTabAsPrev) entryStyle += ' border-top-left-radius: 8px; border-top-right-radius: 8px;';
        if (!sameTabAsNext) entryStyle += ' border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;';
        if (sameTabAsNext) entryStyle += ' margin-bottom: 0; padding-bottom: 4px;';
        if (sameTabAsPrev) entryStyle += ' padding-top: 4px;';
        entryStyle += '"';
      }
      html += '<div class="' + entryClass + '"' + entryStyle + '>\n';

      if (e.isKP && !e.isSecret) {
        var isInfoEntry = isInfoTab(e.tab);
        if (isInfoEntry) {
          var infoColor = infoTabColors[e.tab] || '#ffc107';
          var infoAlpha = bgLum > 0.5 ? 0.1 : 0.25;
          var infoBg = hexToRgba(infoColor, infoAlpha);
          var infoBorder = hexToRgba(infoColor, 0.4);
          html += '<div class="info-note" style="background:' + infoBg + '; border-color:' + infoBorder + '; border-left-color:' + infoColor + ';">\n';
          html += '  <div class="note-tab">\uD83D\uDCCB ' + escapeHtml(e.tab) + '</div>\n';
          html += '  <div class="note-title" style="color:' + infoColor + '; border-bottom-color:' + hexToRgba(infoColor, 0.3) + ';">' + escapeHtml(e.speaker) + '</div>\n';
          html += '  <div class="note-body">' + eContent + '</div>\n';
          html += '</div>\n';
        } else {
          html += '<div class="narration">\n';
          html += '  <div class="narr-name">' + escapeHtml(e.speaker) + '</div>\n';
          html += '  <div class="narr-text">' + eContent + '</div>\n';
          html += '</div>\n';
        }
      } else if (!e.isKP && !e.isSecret && isInfoTab(e.tab)) {
        var infoColor = infoTabColors[e.tab] || '#ffc107';
        var infoAlpha = bgLum > 0.5 ? 0.1 : 0.25;
        var infoBg = hexToRgba(infoColor, infoAlpha);
        var infoBorder = hexToRgba(infoColor, 0.4);
        html += '<div class="info-note" style="background:' + infoBg + '; border-color:' + infoBorder + '; border-left-color:' + infoColor + ';">\n';
        html += '  <div class="note-tab">\uD83D\uDCCB ' + escapeHtml(e.tab) + '</div>\n';
        html += '  <div class="note-title" style="color:' + e.color + ';">' + escapeHtml(e.speaker) + '</div>\n';
        html += '  <div class="note-body">' + eContent + '</div>\n';
        html += '</div>\n';
      } else if (e.isKP && e.isSecret) {
        html += '<div class="narration" style="padding: 4px 0; margin: 0;">\n';
        html += '  <div class="narr-name"><span class="secret-label">[' + escapeHtml(e.tab) + ']</span> ' + escapeHtml(e.speaker) + '</div>\n';
        html += '  <div class="narr-text">' + eContent + '</div>\n';
        html += '</div>\n';
      } else if (e.isSecret) {
        html += '<div class="msg" style="margin-bottom: 0;">\n';
        if (e.overrideIcon || speakerIcons[e.speaker]) {
          html += '  <img class="msg-icon" src="' + (e.overrideIcon || speakerIcons[e.speaker]) + '">\n';
        }
        html += '  <div class="msg-body">\n';
        html += '    <div class="msg-name" style="color:' + e.color + ';"><span class="secret-label">[' + escapeHtml(e.tab) + ']</span> ' + escapeHtml(e.speaker) + '</div>\n';
        html += '    <div class="msg-text">' + eContent + '</div>\n';
        html += '  </div>\n';
        html += '</div>\n';
      } else {
        html += '<div class="msg">\n';
        if (e.overrideIcon || speakerIcons[e.speaker]) {
          html += '  <img class="msg-icon" src="' + (e.overrideIcon || speakerIcons[e.speaker]) + '">\n';
        }
        html += '  <div class="msg-body">\n';
        html += '    <div class="msg-name" style="color:' + e.color + '; text-shadow:' + getTextShadow(e.color, e.speaker) + ';">' + escapeHtml(e.speaker) + '</div>\n';
        html += '    <div class="msg-text">' + eContent + '</div>\n';
        html += '  </div>\n';
        html += '</div>\n';
      }

      html += '</div>\n'; // main-entry
    });
    html += '<div style="clear:both;"></div>\n';
    html += '</div>\n'; // main-col

    html += '</div>\n'; // container

    // Embed data for re-editing
    var saveData = {
      version: 1,
      scenarioTitle: scenarioTitle,
      kpNames: kpNames,
      speakerColors: speakerColors,
      speakerIcons: speakerIcons,
      speakerOutlines: speakerOutlines,
      secretTabColors: secretTabColors,
      infoTabColors: infoTabColors,
      tabTypes: tabTypes,
      tabVisibility: tabVisibility,
      exportBgColor: exportBgColor,
      headerColor1: headerColor1,
      headerColor2: headerColor2,
      headerTextColor: headerTextColor,
      entries: entries
    };
    html += '<script type="application/json" id="ccfolia-data">';
    html += JSON.stringify(saveData).replace(/<\/script>/gi, '<\\/script>');
    html += '</' + 'script>\n';

    html += '</body>\n</html>';

    var blob = new Blob(['\uFEFF' + html], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (scenarioTitle || 'formatted_log') + '.html';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Helper: apply dice highlighting to content HTML
  function applyDiceHighlight(contentHtml) {
    return contentHtml.replace(
      /(\uff1e\s*\d+\s*\uff1e\s*)(\S+)/g,
      function(match, prefix, result) {
        var cls = 'dice-result';
        // Success: 成功, スペシャル, 決定的成功, 決定的成功/スペシャル
        if (result.indexOf('\u6210\u529f') !== -1 || result.indexOf('\u30b9\u30da\u30b7\u30e3\u30eb') !== -1 || result.indexOf('\u6c7a\u5b9a\u7684') !== -1) {
          cls += ' success';
        // Failure: 失敗, ファンブル, 致命的失敗
        } else if (result.indexOf('\u5931\u6557') !== -1 || result.indexOf('\u30d5\u30a1\u30f3\u30d6\u30eb') !== -1 || result.indexOf('\u81f4\u547d\u7684') !== -1) {
          cls += ' failure';
        }
        return prefix + '<span class="' + cls + '">' + result + '</span>';
      }
    );
  }

  // Helper: resize image to maxSize x maxSize and return Data URL
  function resizeImage(srcDataUrl, maxSize, callback) {
    var img = new Image();
    img.onload = function() {
      var w = img.width, h = img.height;
      // Maintain aspect ratio, fit within maxSize x maxSize
      if (w > h) {
        if (w > maxSize) {
          h = h * (maxSize / w);
          w = maxSize;
        }
      } else {
        if (h > maxSize) {
          w = w * (maxSize / h);
          h = maxSize;
        }
      }
      var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      // Use JPEG for compression (quality 0.85), or PNG if has transparency
      callback(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = function() {
      callback(srcDataUrl); // fallback
    };
    img.src = srcDataUrl;
  }

  // Helper: get text-shadow for contrast based on text color vs background
  function getTextShadow(textColor, speakerName) {
    // Check manual override
    var manual = speakerName ? speakerOutlines[speakerName] : null;
    if (manual === 'none') return 'none';
    if (manual === 'white') return '0 0 2px rgba(255,255,255,0.9), 0 0 4px rgba(255,255,255,0.5)';
    if (manual === 'black') return '0 0 2px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.5)';

    // Auto: calculate contrast against background
    var bgColor = exportBgColor || '#f5f5f5';
    var textLum = getLuminance(textColor);
    var bgLum = getLuminance(bgColor);

    // Contrast ratio
    var lighter = Math.max(textLum, bgLum);
    var darker = Math.min(textLum, bgLum);
    var contrast = (lighter + 0.05) / (darker + 0.05);

    // Only add shadow if contrast is too low
    if (contrast < 1.8) {
      // Determine shadow color based on background brightness
      if (bgLum > 0.5) {
        return '1px 1px 0 rgba(0,0,0,0.6), -1px -1px 0 rgba(0,0,0,0.6), 1px -1px 0 rgba(0,0,0,0.6), -1px 1px 0 rgba(0,0,0,0.6)';
      } else {
        return '1px 1px 0 rgba(255,255,255,0.6), -1px -1px 0 rgba(255,255,255,0.6), 1px -1px 0 rgba(255,255,255,0.6), -1px 1px 0 rgba(255,255,255,0.6)';
      }
    }
    return 'none';
  }

  // Helper: calculate relative luminance from hex color
  function getLuminance(hexColor) {
    var hex = hexColor.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16) / 255;
    var g = parseInt(hex.substring(2, 4), 16) / 255;
    var b = parseInt(hex.substring(4, 6), 16) / 255;
    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // Helper: hex color to rgba string
  function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  // Helper: tab type detection (manual override > auto detection)
  function getTabType(tab) {
    if (tabTypes[tab]) return tabTypes[tab];
    // Auto-detect based on name
    if (/^\u79d8\u533f/.test(tab) || /^secret/i.test(tab)) return 'secret';
    if (tab.indexOf('\u96d1\u8ac7') !== -1 || /^other$/i.test(tab) || /^chat$/i.test(tab)) return 'chat';
    if (tab.indexOf('\u60C5\u5831') !== -1 || /^info$/i.test(tab) || /^information$/i.test(tab)) return 'info';
    return 'main';
  }

  function isChatTab(tab) {
    return getTabType(tab) === 'chat';
  }

  function isInfoTab(tab) {
    return getTabType(tab) === 'info';
  }

  function isMainTab(tab) {
    return getTabType(tab) === 'main';
  }

  function isSecretTabType(tab) {
    return getTabType(tab) === 'secret';
  }

  // Helper: get background color for secret tab from PC participant
  function getSecretTabColor(tabName) {
    var color = secretTabColors[tabName];
    if (color) return hexToRgba(color, 0.08);
    return 'rgba(150,150,150,0.08)';
  }

  function getSecretTabBorderColor(tabName) {
    return secretTabColors[tabName] || '#999';
  }

  // Utilities
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
})();
