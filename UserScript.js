// ==UserScript==
// @name         Gemini Code Collapser
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Geminiのコードブロックを自動で折りたたむ（コピー時の全量取得・GUI設定画面対応版）
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_STYLE = GM_getValue('buttonStyle', 3);

    const commonCSS = `
        .custom-processed { scroll-margin-top: 80px; scroll-margin-bottom: 80px; }
        .custom-code-collapsed { max-height: 150px !important; overflow: hidden !important; position: relative; }
        .custom-code-collapsed::after {
            content: ""; position: absolute; bottom: 0; left: 0; width: 100%; height: 48px;
            background: linear-gradient(transparent, rgba(127, 127, 127, 0.1));
            backdrop-filter: blur(2px); pointer-events: none;
        }
    `;

    let buttonCSS = '';
    switch(Number(BUTTON_STYLE)) {
        case 1: buttonCSS = `.custom-toggle-btn { display: block; width: 100%; padding: 8px; margin-top: 4px; position: sticky; bottom: 16px; z-index: 100; background: rgba(127, 127, 127, 0.15); backdrop-filter: blur(8px); border: 1px solid rgba(127, 127, 127, 0.3); color: currentColor; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: bold; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background 0.2s, box-shadow 0.2s; } .custom-toggle-btn:hover { background: rgba(127, 127, 127, 0.25); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }`; break;
        case 2: buttonCSS = `.custom-toggle-btn { display: block; width: 100%; padding: 8px; margin-top: 0; position: sticky; bottom: 0; z-index: 100; background: rgba(127, 127, 127, 0.1); backdrop-filter: blur(12px); border: none; border-top: 1px solid rgba(127, 127, 127, 0.2); color: currentColor; cursor: pointer; font-size: 12px; text-align: center; transition: background 0.2s; } .custom-toggle-btn:hover { background: rgba(127, 127, 127, 0.2); }`; break;
        case 3: buttonCSS = `.custom-toggle-btn { display: block; width: max-content; padding: 8px 24px; margin: 8px auto; position: sticky; bottom: 16px; z-index: 100; background: rgba(127, 127, 127, 0.2); backdrop-filter: blur(8px); border: 1px solid rgba(127, 127, 127, 0.1); border-radius: 20px; color: currentColor; cursor: pointer; font-size: 12px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s, background 0.2s; } .custom-toggle-btn:hover { background: rgba(127, 127, 127, 0.3); transform: scale(1.05); }`; break;
        case 4: buttonCSS = `.custom-toggle-btn { display: block; width: 100%; padding: 8px; margin-top: 4px; position: sticky; bottom: 16px; z-index: 100; background: transparent; border: none; color: #8ab4f8; cursor: pointer; font-size: 13px; font-weight: bold; text-align: center; text-decoration: underline; text-underline-offset: 4px; transition: opacity 0.2s; } @media (prefers-color-scheme: light) { .custom-toggle-btn { color: #0b57d0; } } .custom-toggle-btn:hover { opacity: 0.7; }`; break;
    }

    const modalCSS = `
        #custom-settings-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 2147483647; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
        .custom-modal-content { background: #1e1f20; color: #e3e3e3; padding: 24px; border-radius: 12px; width: 320px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); border: 1px solid #444746; }
        @media (prefers-color-scheme: light) { .custom-modal-content { background: #fff; color: #1f1f1f; border-color: #e0e0e0; } }
        .custom-modal-content h2 { margin: 0 0 16px 0; font-size: 16px; }
        .custom-radio-group { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .custom-radio-group label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; }
        .custom-modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
        .custom-btn { padding: 6px 16px; border-radius: 20px; border: none; cursor: pointer; font-weight: bold; font-size: 14px; }
        .custom-btn-cancel { background: transparent; color: #8ab4f8; }
        @media (prefers-color-scheme: light) { .custom-btn-cancel { color: #0b57d0; } }
        .custom-btn-save { background: #8ab4f8; color: #000; }
        @media (prefers-color-scheme: light) { .custom-btn-save { background: #0b57d0; color: #fff; } }
    `;

    GM_addStyle(commonCSS + buttonCSS + modalCSS);

    const createSettingsModal = () => {
        if (document.getElementById('custom-settings-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'custom-settings-modal';

        const content = document.createElement('div');
        content.className = 'custom-modal-content';

        const title = document.createElement('h2');
        title.textContent = '折りたたみボタンのデザイン設定';
        content.appendChild(title);

        const radioGroup = document.createElement('div');
        radioGroup.className = 'custom-radio-group';

        const options = [
            { val: 1, text: '標準（カード型）' },
            { val: 2, text: 'シームレスバー型' },
            { val: 3, text: 'フローティングピル型' },
            { val: 4, text: 'ミニマルテキスト型' }
        ];

        options.forEach(opt => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'btnStyle';
            input.value = opt.val;
            if (Number(BUTTON_STYLE) === opt.val) input.checked = true;
            
            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + opt.text));
            radioGroup.appendChild(label);
        });
        content.appendChild(radioGroup);

        const actions = document.createElement('div');
        actions.className = 'custom-modal-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'custom-btn custom-btn-cancel';
        cancelBtn.id = 'custom-modal-close';
        cancelBtn.textContent = 'キャンセル';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'custom-btn custom-btn-save';
        saveBtn.id = 'custom-modal-save';
        saveBtn.textContent = '保存して再読込';

        actions.appendChild(cancelBtn);
        actions.appendChild(saveBtn);
        content.appendChild(actions);

        modal.appendChild(content);
        document.body.appendChild(modal);

        cancelBtn.addEventListener('click', () => modal.remove());
        saveBtn.addEventListener('click', () => {
            const selected = document.querySelector('input[name="btnStyle"]:checked').value;
            GM_setValue('buttonStyle', Number(selected));
            location.reload();
        });
    };

    GM_registerMenuCommand("⚙️ デザイン設定", createSettingsModal);

    let timeout = null;

    const applyCollapse = () => {
        const blocks = document.querySelectorAll('pre:not(.custom-processed)');
        blocks.forEach(block => {
            block.classList.add('custom-processed', 'custom-code-collapsed');

            const btn = document.createElement('button');
            btn.className = 'custom-toggle-btn';
            btn.textContent = 'コードを展開';

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const isCollapsed = block.classList.contains('custom-code-collapsed');
                if (isCollapsed) {
                    block.classList.remove('custom-code-collapsed');
                    btn.textContent = 'コードを折りたたむ';
                } else {
                    block.classList.add('custom-code-collapsed');
                    btn.textContent = 'コードを展開';
                    const rect = block.getBoundingClientRect();
                    if (rect.top < 0 || rect.bottom > window.innerHeight) {
                        block.scrollIntoView({ behavior: 'instant', block: 'center' });
                    }
                }
            });

            block.parentNode.insertBefore(btn, block.nextSibling);

            const container = block.closest('code-block') || block.parentElement;
            container.addEventListener('click', (e) => {
                if (e.target.closest('.custom-toggle-btn')) return;
                if (e.target.closest('button')) {
                    if (block.classList.contains('custom-code-collapsed')) {
                        block.classList.remove('custom-code-collapsed');
                        btn.textContent = 'コードを折りたたむ';
                    }
                }
            }, true);
        });
    };

    const observer = new MutationObserver(() => {
        if (timeout) return;
        timeout = setTimeout(() => {
            applyCollapse();
            timeout = null;
        }, 300);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
