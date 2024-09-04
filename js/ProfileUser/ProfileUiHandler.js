function toggleDropdown(sectionId) {
    const section = document.getElementById(sectionId);
    if (section.classList.contains('collapsed')) {
        section.classList.remove('collapsed');
        section.classList.add('expanded');
    } else {
        section.classList.remove('expanded');
        section.classList.add('collapsed');
    }
}

function toggleSidebarCart(sidebarId) {
    const sidebar = document.getElementById(sidebarId);
    sidebar.classList.toggle('translate-x-full');
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    const mainContent = document.querySelector('.main-content');

    modal.classList.toggle('hidden');
    mainContent.classList.toggle('blurred');
}

function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle('-translate-x-full');
}