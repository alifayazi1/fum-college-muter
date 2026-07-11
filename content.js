(function () {
    'use strict';

    if (window.hasRunPooyaCleaner) return;
    window.hasRunPooyaCleaner = true;

    const TARGET_WORD = 'کالج';
    const DELETE_INTERVAL = 300; 

    function showSelectionModal(targets, onConfirm) {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 30px rgba(0,0,0,0.7)',
            zIndex: '2147483647', 
            maxHeight: '80vh',
            width: '500px',
            overflowY: 'auto',
            fontFamily: 'Tahoma, Arial, sans-serif',
            direction: 'rtl',
            border: '2px solid #444'
        });

        const title = document.createElement('h3');
        title.textContent = `پیام‌های یافت‌شده با کلمه "${TARGET_WORD}" (${targets.length})`;
        modal.appendChild(title);

        const listContainer = document.createElement('div');
        listContainer.style.margin = '15px 0';

        const checkboxes = [];

        targets.forEach((msg, index) => {
            const item = document.createElement('div');
            item.style.marginBottom = '8px';
            item.style.borderBottom = '1px solid #eee';
            item.style.paddingBottom = '4px';

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = true;
            cb.id = `del-cb-${index}`;
            cb.style.marginLeft = '8px';

            const label = document.createElement('label');
            label.htmlFor = `del-cb-${index}`;
            label.textContent = msg.textContent.trim().substring(0, 100) + '...';
            label.style.fontSize = '12px';
            label.style.cursor = 'pointer';

            item.appendChild(cb);
            item.appendChild(label);
            listContainer.appendChild(item);
            checkboxes.push({ cb, msg });
        });

        modal.appendChild(listContainer);

        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.justifyContent = 'flex-end';
        btnContainer.style.gap = '10px';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'انصراف';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.onclick = () => document.body.removeChild(modal);

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'حذف موارد انتخاب‌شده';
        confirmBtn.style.backgroundColor = '#d9534f';
        confirmBtn.style.color = 'white';
        confirmBtn.style.border = 'none';
        confirmBtn.style.padding = '8px 15px';
        confirmBtn.style.borderRadius = '4px';
        confirmBtn.style.cursor = 'pointer';

        confirmBtn.onclick = () => {
            const selectedTargets = checkboxes.filter(item => item.cb.checked).map(item => item.msg);
            document.body.removeChild(modal);
            if (selectedTargets.length > 0) {
                onConfirm(selectedTargets);
            }
        };

        btnContainer.appendChild(confirmBtn);
        btnContainer.appendChild(cancelBtn);
        modal.appendChild(btnContainer);

        document.body.appendChild(modal);
    }

    // Execution Logic
    const findMessages = () => {
        const messages = document.querySelectorAll('div[id^="message"]');
        const targets = Array.from(messages).filter(msgDiv => msgDiv.textContent.includes(TARGET_WORD));

        if (targets.length === 0) {
            console.log("Pooya Cleaner: No matching messages found.");
            return;
        }

        showSelectionModal(targets, async (selectedTargets) => {
            const nativeConfirm = window.confirm;
            window.confirm = () => true;

            for (const msgDiv of selectedTargets) {
                const trashButton = msgDiv.querySelector('span[onclick*="MessageInactive"]');
                if (trashButton) {
                    trashButton.click();
                    await new Promise(resolve => setTimeout(resolve, DELETE_INTERVAL));
                }
            }
            window.confirm = nativeConfirm;
            alert(`تعداد ${selectedTargets.length} پیام حذف شد. صفحه را رفرش کنید.`);
        });
    };

    if (document.readyState === 'complete') {
        setTimeout(findMessages, 2000);
    } else {
        window.addEventListener('load', () => setTimeout(findMessages, 2000));
    }
})();