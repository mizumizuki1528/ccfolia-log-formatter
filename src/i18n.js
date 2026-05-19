// i18n - Japanese labels applied after DOM load

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // Header
    document.querySelector('#header h1').textContent = '\u30B3\u30B3\u30D5\u30A9\u30EA\u30A2 \u30ED\u30B0\u6574\u5F62\u30C4\u30FC\u30EB';
    document.title = '\u30B3\u30B3\u30D5\u30A9\u30EA\u30A2 \u30ED\u30B0\u6574\u5F62\u30C4\u30FC\u30EB';

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
  });
})();
