// Allow clocks to be dragged and dropped & setup event listeners
const clocksContainer = document.getElementById('clocks-container');
if (clocksContainer) {
    clocksContainer.addEventListener('dragstart', (event: DragEvent) => {
        console.log('dragstart');
        const target = event.target as HTMLElement;
        const clockWrapper = target.closest('.clock-wrapper');
        if (clockWrapper) {
            clockWrapper.classList.add('dragging');
            event.dataTransfer?.setData('text/plain', clockWrapper.id);
            event.dataTransfer!.effectAllowed = 'move';
        }
    });

    clocksContainer.addEventListener('dragend', (event: DragEvent) => {
        const target = event.target as HTMLElement;
        const clockWrapper = target.closest('.clock-wrapper');
        if (clockWrapper) {
            clockWrapper.classList.remove('dragging');
        }
    });

    clocksContainer.addEventListener('dragover', (event: DragEvent) => {
        event.preventDefault();
        const dragging = document.querySelector('.dragging') as HTMLElement;
        if (!dragging) return;

        const afterElement = getDragAfterElement(clocksContainer, event.clientX, event.clientY);
        if (afterElement == null) {
            clocksContainer.appendChild(dragging);
        } else {
            clocksContainer.insertBefore(dragging, afterElement);
        }
    });
}

// Get the element the one being dragged should be placed before
function getDragAfterElement(container: HTMLElement, x: number, y: number): HTMLElement | null {
    const draggableElements = Array.from(container.querySelectorAll('.clock-wrapper:not(.dragging)')) as HTMLElement[];

    let closest = {distance: Number.POSITIVE_INFINITY, element: null as HTMLElement | null};

    draggableElements.forEach(child => {
        const box = child.getBoundingClientRect();
        const childCenterX = box.left + box.width / 2;
        const childCenterY = box.top + box.height / 2;
        const distance = Math.hypot(x - childCenterX, y - childCenterY);
        if (distance < closest.distance) {
            closest = {distance, element: child};
        }
    });

    return closest.element;
}