// i18n - Japanese labels applied after DOM load

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // Header
    document.querySelector('#header h1').textContent = '\u30B3\u30B3\u30D5\u30A9\u30EA\u30A2 \u30ED\u30B0\u6574\u5F62\u30C4\u30FC\u30EB';
    document.title = '\u30B3\u30B3\u30D5\u30A9\u30EA\u30A2 \u30ED\u30B0\u6574\u5F62\u30C4\u30FC\u30EB';
    var h1El = document.querySelector('#header h1');
    if (h1El) {
      h1El.setAttribute('data-edit-hint', '\u30AF\u30EA\u30C3\u30AF\u3067\u30BF\u30A4\u30C8\u30EB\u3092\u7DE8\u96C6');
      h1El.setAttribute('data-edit-prompt', '\u30BF\u30A4\u30C8\u30EB\uFF1A');
    }

    // Help button
    var btnHelp = document.getElementById('btn-help');
    if (btnHelp) btnHelp.title = '\u4F7F\u3044\u65B9';
    var btnChangelog = document.getElementById('btn-changelog');
    if (btnChangelog) btnChangelog.title = '\u66F4\u65B0\u5C65\u6B74';

    // Help modal
    var helpH3 = document.querySelector('#help-modal h3');
    if (helpH3) helpH3.textContent = '\u4F7F\u3044\u65B9';
    var helpContent = document.getElementById('help-content');
    if (helpContent) {
      helpContent.innerHTML = '<h4>\u57FA\u672C\u306E\u6D41\u308C</h4>'
        + '<ol><li>\u30B3\u30B3\u30D5\u30A9\u30EA\u30A2\u306E\u30ED\u30B0HTML\u3092\u30C9\u30ED\u30C3\u30D7 or \u9078\u629E</li>'
        + '<li>\u30B7\u30CA\u30EA\u30AA\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B</li>'
        + '<li>KP\uFF08\u30CA\u30EC\u30FC\u30BF\u30FC\uFF09\u3092\u9078\u629E\u3057\u3066\u300C\u6C7A\u5B9A\u300D</li>'
        + '<li>\u7DE8\u96C6\u753B\u9762\u3067\u30ED\u30B0\u3092\u6574\u5F62</li>'
        + '<li>\u300C\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u300D\u3067HTML\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9</li></ol>'
        + '<h4>\u64CD\u4F5C\u30DC\u30BF\u30F3</h4>'
        + '<ul><li>\u270F \u2026 \u767A\u8A00\u3092\u7DE8\u96C6</li>'
        + '<li>\uD83D\uDCD6 \u2026 \u8A71\u533A\u5207\u308A\u3092\u8FFD\u52A0</li>'
        + '<li>\u2716 \u2026 \u767A\u8A00\u3092\u524A\u9664</li>'
        + '<li>\u30C9\u30E9\u30C3\u30B0\uFF06\u30C9\u30ED\u30C3\u30D7\u3067\u4E26\u3079\u66FF\u3048</li></ul>'
        + '<h4>\u8A2D\u5B9A</h4>'
        + '<ul><li>\u30BF\u30D6\u8A2D\u5B9A \u2026 \u30BF\u30D6\u306E\u7A2E\u985E\u30FB\u8868\u793AON/OFF\u30FB\u80CC\u666F\u8272</li>'
        + '<li>\u8272\u8A2D\u5B9A \u2026 \u767A\u8A00\u8005\u306E\u8272\u30FB\u30A2\u30A4\u30B3\u30F3\u30FB\u5730\u6587\u30FB\u7E01\u53D6\u308A</li>'
        + '<li>\u80CC\u666F\u8272 \u2026 \u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306E\u80CC\u666F\u8272</li>'
        + '<li>\u30D8\u30C3\u30C0\u30FC\u8272 \u2026 \u30B0\u30E9\u30C7\u30FC\u30B7\u30E7\u30F3\u8A2D\u5B9A</li></ul>'
        + '<h4>\u305D\u306E\u4ED6</h4>'
        + '<ul><li>\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3057\u305FHTML\u3092\u518D\u5EA6\u8AAD\u307F\u8FBC\u3080\u3068\u7D9A\u304D\u304B\u3089\u7DE8\u96C6\u53EF\u80FD</li>'
        + '<li>\u5225\u306E\u30D5\u30A1\u30A4\u30EB\u3092\u8AAD\u307F\u8FBC\u3080\u5834\u5408\u306F\u30D6\u30E9\u30A6\u30B6\u3092\u30EA\u30ED\u30FC\u30C9</li></ul>';
    }

    // Changelog modal
    var chgH3 = document.querySelector('#changelog-modal h3');
    if (chgH3) chgH3.textContent = '\u66F4\u65B0\u5C65\u6B74';
    var chgContent = document.getElementById('changelog-content');
    if (chgContent) {
      chgContent.innerHTML = '<h4>Ver 1.1 (2026/05/19)</h4>'
        + '<ul><li>\u7E01\u53D6\u308A\u3092\u304F\u3063\u304D\u308A\u8868\u793A\u306B\u5909\u66F4\uFF08\u307C\u304B\u3057\u306A\u3057\uFF09</li>'
        + '<li>\u30D3\u30E5\u30FC\u30A2\u753B\u9762\u3067\u30BF\u30A4\u30C8\u30EB\u7DE8\u96C6\u53EF\u80FD\u306B\uFF08\u30E2\u30FC\u30C0\u30EB\u5F62\u5F0F\uFF09</li>'
        + '<li>\u767A\u8A00\u5358\u4F4D\u3067\u30A2\u30A4\u30B3\u30F3\u5DEE\u3057\u66FF\u3048\u6A5F\u80FD\u3092\u8FFD\u52A0</li>'
        + '<li>\u7AE0\u306E\u91CD\u8907\u8868\u793A\u30D0\u30B0\u3092\u4FEE\u6B63</li>'
        + '<li>\u300C\u7B2CN\u8A71\u300D\u30D1\u30BF\u30FC\u30F3\u306E\u7AE0\u691C\u51FA\u306B\u5BFE\u5FDC</li>'
        + '<li>\u4F7F\u3044\u65B9\u30FB\u66F4\u65B0\u5C65\u6B74\u30E2\u30FC\u30C0\u30EB\u3092\u30D8\u30C3\u30C0\u30FC\u306B\u8FFD\u52A0</li>'
        + '<li>\u30D0\u30FC\u30B8\u30E7\u30F3\u60C5\u5831\u3092\u30D5\u30C3\u30BF\u30FC\u306B\u5E38\u6642\u8868\u793A</li></ul>'
        + '<h4>Ver 1.0 (2026/05/14)</h4>'
        + '<ul><li>\u521D\u56DE\u914D\u5E03\u7248</li>'
        + '<li>\u80CC\u666F\u8272\u5909\u66F4\u6A5F\u80FD\uFF08\u6697\u3044\u80CC\u666F\u306B\u3082\u5BFE\u5FDC\uFF09</li>'
        + '<li>\u30D8\u30C3\u30C0\u30FC\u30AB\u30E9\u30FC\u8A2D\u5B9A\uFF082\u8272\u30B0\u30E9\u30C7\u30FC\u30B7\u30E7\u30F3\u5BFE\u5FDC\uFF09</li>'
        + '<li>\u767A\u8A00\u8005\u540D\u306E\u7E01\u53D6\u308A\u81EA\u52D5\u5224\u5B9A\uFF08\u767D/\u9ED2\uFF09</li>'
        + '<li>\u30C0\u30A4\u30B9\u30ED\u30FC\u30EB\u7D50\u679C\u306E\u30CF\u30A4\u30E9\u30A4\u30C8\uFF08\u6210\u529F=\u9752\u3001\u5931\u6557=\u8D64\uFF09</li>'
        + '<li>\u30AB\u30E9\u30FC\u30D1\u30CD\u30EB\u6539\u5584\uFF08\u767A\u8A00\u6570\u9806\u30BD\u30FC\u30C8\u30012\u884C\u69CB\u6210\uFF09</li>'
        + '<li>\u30B9\u30DE\u30DB\u5BFE\u5FDC\uFF08\u30EC\u30B9\u30DD\u30F3\u30B7\u30D6\u3001iPhone\u30BB\u30FC\u30D5\u30A8\u30EA\u30A2\uFF09</li>'
        + '<li>\u7AE0\u30CA\u30D3\u3092\u30EA\u30F3\u30AF\u30DC\u30BF\u30F3\u65B9\u5F0F\u306B\uFF08JS\u4E0D\u8981\uFF09</li>'
        + '<li>\u7AE0\u306E\u7DE8\u96C6\u30FB\u77ED\u7E2E\u540D\u8A2D\u5B9A\u3092\u30E2\u30FC\u30C0\u30EB\u5316</li>'
        + '<li>\u7DE8\u96C6\u6E08\u307FHTML\u306E\u518D\u8AAD\u307F\u8FBC\u307F\u5BFE\u5FDC</li>'
        + '<li>\u30A2\u30A4\u30B3\u30F3\u753B\u50CF\u306E\u81EA\u52D5\u30EA\u30B5\u30A4\u30BA\uFF08128x128\uFF09</li></ul>';
    }

    // Header buttons
    var btnExport = document.getElementById('btn-export');
    btnExport.textContent = '\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8';

    // Tabs button
    var btnTabs = document.getElementById('btn-tabs');
    if (btnTabs) btnTabs.textContent = '\u30BF\u30D6\u8A2D\u5B9A';

    // Tab panel
    var tabPanelH3 = document.querySelector('#tab-panel h3');
    if (tabPanelH3) tabPanelH3.textContent = '\u30BF\u30D6\u8A2D\u5B9A';
    var tabPanel = document.getElementById('tab-panel');
    if (tabPanel) {
      tabPanel.setAttribute('data-type-main', '\u30E1\u30A4\u30F3');
      tabPanel.setAttribute('data-type-chat', '\u96D1\u8AC7');
      tabPanel.setAttribute('data-type-info', '\u60C5\u5831');
      tabPanel.setAttribute('data-type-secret', '\u79D8\u533F');
      tabPanel.setAttribute('data-show-label', '\u8868\u793A');
    }

    // Color button
    var btnColors = document.getElementById('btn-colors');
    btnColors.textContent = '\u8272\u8A2D\u5B9A';

    // Color panel header
    var colorPanelH3 = document.querySelector('#color-panel h3');
    if (colorPanelH3) colorPanelH3.textContent = '\u767A\u8A00\u8005\u306E\u8272\u30FB\u30A2\u30A4\u30B3\u30F3\u8A2D\u5B9A';

    // KP toggle label
    var colorPanel = document.getElementById('color-panel');
    if (colorPanel) {
      colorPanel.setAttribute('data-kp-label', '\u5730\u6587');
      colorPanel.setAttribute('data-outline-auto', '\u81EA\u52D5');
      colorPanel.setAttribute('data-outline-none', '\u306A\u3057');
      colorPanel.setAttribute('data-outline-black', '\u9ED2');
      colorPanel.setAttribute('data-outline-white', '\u767D');
    }

    // Color section headers will be set dynamically via data attributes
    document.getElementById('color-panel').setAttribute('data-secret-label', '\u79D8\u533F\u30BF\u30D6');
    document.getElementById('color-panel').setAttribute('data-info-label', '\u60C5\u5831\u30BF\u30D6');
    document.getElementById('color-panel').setAttribute('data-speaker-label', '\u767A\u8A00\u8005');

    // File area
    var dropP = document.querySelector('#drop-zone > p');
    dropP.innerHTML = '\u30B3\u30B3\u30D5\u30A9\u30EA\u30A2\u306E\u30ED\u30B0HTML\u3092\u30C9\u30E9\u30C3\u30B0\uFF06\u30C9\u30ED\u30C3\u30D7<br>\u307E\u305F\u306F';

    var fileLabel = document.querySelector('.file-label');
    // Keep input, replace text
    var fileInput = fileLabel.querySelector('input');
    fileLabel.textContent = '';
    fileLabel.appendChild(fileInput);
    fileLabel.appendChild(document.createTextNode('\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u629E'));

    var hint = document.querySelector('#drop-zone .hint');
    hint.textContent = '\u8907\u6570\u30D5\u30A1\u30A4\u30EB\u3067\u90E8\u5C4B\u5225\u7D50\u5408\u3082\u53EF\u80FD\u3000\u30FB\u3000\u7DE8\u96C6\u6E08\u307FHTML\u306E\u518D\u8AAD\u307F\u8FBC\u307F\u3082\u5BFE\u5FDC';

    // KP selection
    document.querySelector('.kp-select-box h2').textContent = 'KP\uFF08\u30CA\u30EC\u30FC\u30BF\u30FC\uFF09\u306E\u9078\u629E';
    var titleLabel = document.querySelector('.title-input-label span');
    if (titleLabel) titleLabel.textContent = '\u30B7\u30CA\u30EA\u30AA\u30BF\u30A4\u30C8\u30EB\uFF1A';
    var titleInput = document.getElementById('scenario-title');
    if (titleInput) titleInput.placeholder = '\u30B7\u30CA\u30EA\u30AA\u30BF\u30A4\u30C8\u30EB\u3092\u5165\u529B';
    document.querySelector('.kp-select-box p').textContent = 'KP\uFF08\u30CA\u30EC\u30FC\u30BF\u30FC\uFF09\u3068\u3057\u3066\u6271\u3046\u767A\u8A00\u8005\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\uFF1A';
    document.getElementById('kp-confirm').textContent = '\u6C7A\u5B9A';
    document.getElementById('kp-skip').textContent = '\u30B9\u30AD\u30C3\u30D7\uFF08KP\u306A\u3057\uFF09';
    var kpReselectBtn = document.getElementById('kp-reselect');
    if (kpReselectBtn) kpReselectBtn.textContent = '\u30D5\u30A1\u30A4\u30EB\u3092\u518D\u9078\u629E';

    // Search
    document.getElementById('search-input').placeholder = '\u691C\u7D22...';

    // Background color label
    var bgLabel = document.querySelector('.bg-color-label');
    if (bgLabel) bgLabel.childNodes[0].textContent = '\u80CC\u666F:';

    // Header color label
    var hdrLabel = document.querySelector('.hdr-color-label');
    if (hdrLabel) hdrLabel.childNodes[0].textContent = '\u30D8\u30C3\u30C0\u30FC:';

    // Chapter nav
    var chapterNav = document.getElementById('chapter-nav');
    if (chapterNav) {
      chapterNav.setAttribute('data-label', '\u8A71\u3078\u30B8\u30E3\u30F3\u30D7\uFF1A');
      chapterNav.setAttribute('data-placeholder', '-- \u8A71\u3092\u9078\u629E --');
    }

    // Edit modal
    document.querySelector('#edit-modal h3').textContent = '\u767A\u8A00\u3092\u7DE8\u96C6';

    // Title modal
    var titleModalH3 = document.querySelector('#title-modal h3');
    if (titleModalH3) titleModalH3.textContent = '\u30BF\u30A4\u30C8\u30EB\u3092\u7DE8\u96C6';
    var titleLabels = document.querySelectorAll('#title-modal label');
    if (titleLabels[0]) titleLabels[0].childNodes[0].textContent = '\u30BF\u30A4\u30C8\u30EB\uFF1A';
    var titleSaveBtn = document.getElementById('title-save');
    if (titleSaveBtn) titleSaveBtn.textContent = '\u4FDD\u5B58';
    var titleCancelBtn = document.getElementById('title-cancel');
    if (titleCancelBtn) titleCancelBtn.textContent = '\u30AD\u30E3\u30F3\u30BB\u30EB';
    var editTabLabel = document.querySelector('.edit-tab-label');
    if (editTabLabel) editTabLabel.textContent = '\u30BF\u30D6\uFF1A';
    var labels = document.querySelectorAll('#edit-modal label');
    if (labels[0]) labels[0].childNodes[0].textContent = '\u767A\u8A00\u8005\uFF1A';
    if (labels[1]) labels[1].childNodes[0].textContent = '\u5185\u5BB9\uFF1A';
    if (labels[2]) labels[2].childNodes[0].textContent = '\u8272\uFF1A';
    document.getElementById('edit-save').textContent = '\u4FDD\u5B58';
    document.getElementById('edit-cancel').textContent = '\u30AD\u30E3\u30F3\u30BB\u30EB';

    // Chapter modal
    var chModalH3 = document.querySelector('#chapter-modal h3');
    if (chModalH3) chModalH3.textContent = '\u8A71\u3092\u7DE8\u96C6';
    var chLabels = document.querySelectorAll('#chapter-modal label');
    if (chLabels[0]) chLabels[0].childNodes[0].textContent = '\u8A71\u540D\uFF1A';
    if (chLabels[1]) chLabels[1].childNodes[0].textContent = '\u77ED\u7E2E\u540D\uFF08\u30CA\u30D3\u7528\uFF09\uFF1A';
    var chShortInput = document.getElementById('chapter-short-input');
    if (chShortInput) chShortInput.placeholder = '\u7A7A\u6B04\u3067\u6B63\u5F0F\u540D\u3092\u4F7F\u7528';
    document.getElementById('chapter-save').textContent = '\u4FDD\u5B58';
    document.getElementById('chapter-cancel').textContent = '\u30AD\u30E3\u30F3\u30BB\u30EB';

    // KP checkbox label
    var kpLabel = document.querySelector('#edit-modal .checkbox-label');
    if (kpLabel) {
      var cb = kpLabel.querySelector('input');
      kpLabel.textContent = '';
      kpLabel.appendChild(cb);
      kpLabel.appendChild(document.createTextNode(' \u5730\u6587\u3068\u3057\u3066\u8868\u793A'));
    }

    // Edit icon labels
    var editIconLabel = document.querySelector('.edit-icon-label');
    if (editIconLabel) editIconLabel.textContent = '\u30A2\u30A4\u30B3\u30F3\uFF1A';
    var editIconChange = document.getElementById('edit-icon-change');
    if (editIconChange) editIconChange.textContent = '\u5909\u66F4';
    var editIconReset = document.getElementById('edit-icon-reset');
    if (editIconReset) editIconReset.textContent = '\u30EA\u30BB\u30C3\u30C8';
  });
})();
