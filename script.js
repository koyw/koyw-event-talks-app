document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const talks = document.querySelectorAll('.talk');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        talks.forEach(talk => {
            const categories = talk.dataset.categories.toLowerCase();
            if (categories.includes(searchTerm)) {
                talk.style.display = 'block';
            } else {
                talk.style.display = 'none';
            }
        });
    });
});
