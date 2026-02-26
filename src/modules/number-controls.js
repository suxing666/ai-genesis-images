// 初始化数字输入框的自定义箭头
export function initNumberInputControls() {
    const numberInputs = document.querySelectorAll('input[type="number"]');

    numberInputs.forEach(input => {
        const controls = input.nextElementSibling;
        if (!controls || !controls.classList.contains('number-controls')) return;

        const incrementBtn = controls.querySelector('.increment');
        const decrementBtn = controls.querySelector('.decrement');

        if (incrementBtn) {
            incrementBtn.addEventListener('click', () => {
                const step = parseFloat(input.step) || 1;
                const max = parseFloat(input.max);
                const currentValue = parseFloat(input.value) || 0;
                const newValue = currentValue + step;

                if (!max || newValue <= max) {
                    input.value = newValue;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        }

        if (decrementBtn) {
            decrementBtn.addEventListener('click', () => {
                const step = parseFloat(input.step) || 1;
                const min = parseFloat(input.min);
                const currentValue = parseFloat(input.value) || 0;
                const newValue = currentValue - step;

                if (min === undefined || newValue >= min) {
                    input.value = newValue;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        }
    });
}
