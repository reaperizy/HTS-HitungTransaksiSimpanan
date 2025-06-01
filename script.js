// Menunggu semua elemen HTML dimuat sebelum menjalankan JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // === BAGIAN 1: MEMILIH SEMUA ELEMEN ===
    const balance = document.getElementById('balance');
    const list = document.getElementById('transactions-list');
    const form = document.getElementById('transaction-form');
    const type = document.getElementById('type');
    const description = document.getElementById('description');
    const amount = document.getElementById('amount');
    const bank = document.getElementById('bank');
    
    // Pastikan baris ini ada dan id-nya benar ('clear-btn')
    const clearBtn = document.getElementById('clear-btn');

    // === BAGIAN 2: MENGAMBIL DATA DARI LOCALSTORAGE ===
    const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
    let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

    // === BAGIAN 3: SEMUA FUNGSI ===

    // Fungsi untuk menyimpan transaksi ke LocalStorage
    function saveTransactionsToLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Fungsi untuk menambah transaksi baru
    function addTransaction(e) {
        e.preventDefault();
        if (description.value.trim() === '' || amount.value.trim() === '' || bank.value.trim() === '') {
            alert('Harap isi semua kolom');
        } else {
            const transaction = {
                id: generateID(),
                type: type.value,
                description: description.value,
                amount: +amount.value,
                bank: bank.value,
                date: new Date().toLocaleDateString('id-ID')
            };
            transactions.push(transaction);
            addTransactionDOM(transaction);
            updateBalance();
            saveTransactionsToLocalStorage();
            form.reset(); // Cara lebih baik untuk mengosongkan form
        }
    }

    // Fungsi untuk menampilkan transaksi di DOM
    function addTransactionDOM(transaction) {
        const sign = transaction.type === 'pemasukan' ? '+' : '-';
        const item = document.createElement('li');
        item.classList.add(transaction.type);
        item.innerHTML = `
            <div>
                ${transaction.description} <small>(${transaction.date} dari ${transaction.bank})</small>
            </div>
            <span>${sign} ${formatRupiah(transaction.amount)}</span>
        `;
        list.appendChild(item);
    }
    
    // Fungsi untuk memperbarui total saldo
    function updateBalance() {
        const amounts = transactions.map(t => t.type === 'pemasukan' ? t.amount : -t.amount);
        const total = amounts.reduce((acc, item) => (acc += item), 0);
        balance.innerText = formatRupiah(total);
    }

    // Fungsi format Rupiah
    function formatRupiah(number) {
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(number);
    }

    // Fungsi membuat ID unik
    function generateID() {
        return Math.floor(Math.random() * 1000000000);
    }
    
    // Fungsi untuk menghapus semua data
    function clearAllData() {
        if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat transaksi? Tindakan ini tidak dapat dibatalkan.')) {
            transactions = []; // Kosongkan array di memori
            localStorage.removeItem('transactions'); // Hapus dari localStorage
            init(); // Perbarui tampilan
        }
    }

    // Fungsi untuk menginisialisasi aplikasi
    function init() {
        list.innerHTML = '';
        transactions.forEach(addTransactionDOM);
        updateBalance();
    }
    
    // === BAGIAN 4: EVENT LISTENERS ===
    
    // Menjalankan init saat halaman dimuat
    init();

    // Listener untuk form submit
    form.addEventListener('submit', addTransaction);
    
    // Pastikan baris ini ada. Ini yang menghubungkan tombol "Hapus" dengan fungsinya
    clearBtn.addEventListener('click', clearAllData);
});