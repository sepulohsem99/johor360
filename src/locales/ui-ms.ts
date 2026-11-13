/**
 * Bahasa Melayu UI copy, keyed on the exact English source string.
 *
 * This exists because the interface was written English-first. Rather than
 * refactoring 240 call sites into synthetic keys (which risks blanking the UI
 * when a key is mistyped), `tx()` looks the rendered sentence up here and falls
 * back to the English original. A missing row degrades to English, never to an
 * empty string.
 *
 * Rules for adding rows:
 *  - Key must match the JSX text exactly, including em dashes and ellipsis.
 *  - Do not translate product nouns that are proper nouns (JOHOR360, ETS, PKS).
 *  - Keep it Malaysian Malay, not textbook Malay: "anda" is acceptable here
 *    because this is product UI, not personal messaging.
 */
export const UI_MS: Record<string, string> = {
  'About this experience': 'Tentang pengalaman ini',
  'About this verification': 'Tentang pengesahan ini',
  'About you': 'Tentang anda',
  'Accessibility notes': 'Nota kebolehaksesan',
  'Accessibility statement verified against photographs. Approved for publication.':
    'Pernyataan kebolehaksesan disemak dengan foto. Diluluskan untuk penerbitan.',
  Action: 'Tindakan',
  'Add a stop': 'Tambah perhentian',
  'Add an experience from the corridor, or generate a plan from your matches.':
    'Tambah pengalaman dari koridor, atau jana pelan dari padanan anda.',
  'Add stop': 'Tambah perhentian',
  'Adjust the scenario': 'Ubah senario',
  'All figures are simulated demonstration data.': 'Semua angka ialah data demonstrasi simulasi.',
  'All saved': 'Semua disimpan',
  'All stations': 'Semua stesen',
  'All statuses': 'Semua status',
  'All trips': 'Semua perjalanan',
  'All unresolved': 'Semua belum selesai',
  'Already have one?': 'Sudah ada akaun?',
  'Answer honestly — these become hard constraints in matching.':
    'Jawab dengan jujur — ini menjadi kekangan keras dalam pemadanan.',
  'Appears on cards. 20–140 characters.': 'Dipaparkan pada kad. 20–140 aksara.',
  'Applied as hard constraints, not soft preferences.':
    'Digunakan sebagai kekangan keras, bukan keutamaan lembut.',
  'Approve listings to make them visible in visitor discovery.':
    'Luluskan penyenaraian untuk dipaparkan dalam penemuan pelawat.',
  'At least 15 characters. Be specific — what worked, what to know before booking.':
    'Sekurang-kurangnya 15 aksara. Nyatakan dengan jelas — apa yang berkesan, apa perlu tahu sebelum menempah.',
  'At least 60 characters. Be honest about what is included and what is not.':
    'Sekurang-kurangnya 60 aksara. Jujur tentang apa yang termasuk dan apa yang tidak.',
  'Available time': 'Masa tersedia',
  'Back home': 'Kembali ke utama',
  'Back to corridor': 'Kembali ke koridor',
  'Back to listings': 'Kembali ke penyenaraian',
  'Back to sign in': 'Kembali ke log masuk',
  'Be the first to leave demonstration feedback for this listing.':
    'Jadilah yang pertama memberi maklum balas demonstrasi untuk penyenaraian ini.',
  'Beyond the city': 'Melangkaui bandar',
  'Browse experiences': 'Layari pengalaman',
  Budget: 'Bajet',
  'Budget per person': 'Bajet setiap orang',
  'Built for': 'Dibina untuk',
  Cancel: 'Batal',
  'Category 4: Connecting visitors in Johor': 'Kategori 4: Menghubungkan pelawat di Johor',
  'Category filter': 'Penapis kategori',
  'Check your inbox': 'Semak peti masuk anda',
  'Choose what kind of account you need.': 'Pilih jenis akaun yang anda perlukan.',
  Close: 'Tutup',
  'Close dialog': 'Tutup dialog',
  'Configuration for the demo environment. Changes are local only.':
    'Konfigurasi untuk persekitaran demo. Perubahan setempat sahaja.',
  'Content operations, verification queue and platform health.':
    'Operasi kandungan, baris gilir pengesahan dan kesihatan platform.',
  Continue: 'Teruskan',
  'Continue as guest': 'Teruskan sebagai tetamu',
  'Country of origin': 'Negara asal',
  Delete: 'Padam',
  'Delete itinerary': 'Padam itinerari',
  'Demo enquiries': 'Pertanyaan demo',
  'Demo only — no email is dispatched.': 'Demo sahaja — tiada e-mel dihantar.',
  'Demo operator': 'Operator demo',
  'Demo reviews': 'Ulasan demo',
  'Display name': 'Nama paparan',
  'Distribution of discovery': 'Taburan penemuan',
  'Distribution of visitor intent across purpose, station and category.':
    'Taburan niat pelawat mengikut tujuan, stesen dan kategori.',
  'Drag to reorder · times auto-assign': 'Seret untuk susun semula · masa ditetapkan automatik',
  'Draw wax lines by hand with a canting pen, then dye a 40cm cotton square.':
    'Lukis garisan lilin dengan tangan menggunakan canting, kemudian celup kain kapas 40cm.',
  Duration: 'Tempoh',
  'Duration (minutes)': 'Tempoh (minit)',
  'Edit preferences': 'Ubah keutamaan',
  Email: 'E-mel',
  'Email (mock)': 'E-mel (mock)',
  Enquiries: 'Pertanyaan',
  'Enquiries from visitors will appear in this queue.':
    'Pertanyaan daripada pelawat akan muncul dalam baris gilir ini.',
  'Enquiries sent': 'Pertanyaan dihantar',
  'Enquiry conversion': 'Penukaran pertanyaan',
  'Enquiry details': 'Butiran pertanyaan',
  'Enquiry funnel': 'Corong pertanyaan',
  'Enquiry sources': 'Sumber pertanyaan',
  'Enter your email and we will send a reset link.':
    'Masukkan e-mel anda dan kami akan hantar pautan set semula.',
  'Every external claim in the product traces to a source here.':
    'Setiap dakwaan luaran dalam produk ini mempunyai sumber di sini.',
  'Experience management': 'Pengurusan pengalaman',
  'Experience map': 'Peta pengalaman',
  'Experience not found': 'Pengalaman tidak dijumpai',
  'Experience title': 'Tajuk pengalaman',
  Experiences: 'Pengalaman',
  'Explore experiences': 'Terokai pengalaman',
  'Five steps from unlisted to discoverable':
    'Lima langkah dari tidak tersenarai ke boleh ditemui',
  'For operators': 'Untuk operator',
  'Full day': 'Sepanjang hari',
  'Generate from matches': 'Jana dari padanan',
  'Generate new': 'Jana baharu',
  'Generate one from your matches or build it manually.':
    'Jana dari padanan anda atau bina secara manual.',
  'Generated deterministically from your preferences — no external AI service.':
    'Dijana secara deterministik daripada keutamaan anda — tiada perkhidmatan AI luaran.',
  'How does a visitor get from the station to you?':
    'Bagaimana pelawat sampai dari stesen ke tempat anda?',
  'How much time do you have?': 'Berapa banyak masa anda ada?',
  'How the matching engine works': 'Bagaimana enjin pemadanan berfungsi',
  'How we chose to be different': 'Bagaimana kami memilih untuk berbeza',
  'If you run it, visitors should be able to find it.':
    'Jika anda mengusahakannya, pelawat sepatutnya boleh menemuinya.',
  'Illustration of Johor heritage rooftops and the ETS rail corridor':
    'Ilustrasi bumbung warisan Johor dan koridor rel ETS',
  'In review': 'Dalam semakan',
  'Indicative price': 'Harga indikatif',
  'Itinerary name': 'Nama itinerari',
  "Let's set up your trip": 'Mari sediakan perjalanan anda',
  'Manage all': 'Urus semua',
  'Map of Johor ETS corridor experiences': 'Peta pengalaman koridor ETS Johor',
  'Mention your train time, mobility needs or anything else relevant.':
    'Nyatakan masa tren, keperluan mobiliti atau apa-apa yang berkaitan.',
  Message: 'Mesej',
  'Minimum 6 characters. Not stored anywhere.': 'Minimum 6 aksara. Tidak disimpan di mana-mana.',
  'Mock booking enquiry.': 'Pertanyaan tempahan mock.',
  'Nearest ETS station': 'Stesen ETS terdekat',
  'New enquiries': 'Pertanyaan baharu',
  'New listing': 'Penyenaraian baharu',
  'New visitor reviews appear here before publishing.':
    'Ulasan pelawat baharu muncul di sini sebelum diterbitkan.',
  'Next step': 'Langkah seterusnya',
  'Nine stations. One line. Most of them you have never heard of.':
    'Sembilan stesen. Satu laluan. Kebanyakannya belum pernah anda dengar.',
  'No account needed': 'Tiada akaun diperlukan',
  'No account?': 'Tiada akaun?',
  'No enquiries here': 'Tiada pertanyaan di sini',
  'No experiences pass your constraints': 'Tiada pengalaman melepasi kekangan anda',
  'No itineraries saved': 'Tiada itinerari disimpan',
  'No itinerary yet': 'Belum ada itinerari',
  'No listed operator here yet': 'Belum ada operator tersenarai di sini',
  'No listings are awaiting verification. New SME submissions will appear here.':
    'Tiada penyenaraian menunggu pengesahan. Penyerahan PKS baharu akan muncul di sini.',
  'No listings in this state': 'Tiada penyenaraian dalam keadaan ini',
  'No listings match': 'Tiada penyenaraian sepadan',
  'No listings match these filters.': 'Tiada penyenaraian sepadan dengan penapis ini.',
  'No listings yet.': 'Belum ada penyenaraian.',
  'No matching experiences left to add.': 'Tiada pengalaman sepadan lagi untuk ditambah.',
  'No published listings': 'Tiada penyenaraian diterbitkan',
  'No real auth': 'Tiada pengesahan sebenar',
  'No real signup': 'Tiada pendaftaran sebenar',
  'No reviews yet': 'Belum ada ulasan',
  'No saved itineraries yet. Build one from your matches.':
    'Belum ada itinerari disimpan. Bina satu dari padanan anda.',
  'No verified experience fits this window.':
    'Tiada pengalaman disahkan yang sesuai dengan tetingkap ini.',
  'Nothing passes your constraints': 'Tiada yang melepasi kekangan anda',
  'Nothing saved yet. Tap the heart on any experience.':
    'Belum ada yang disimpan. Tekan hati pada mana-mana pengalaman.',
  'Nothing to moderate': 'Tiada untuk dimoderasi',
  'Number of people': 'Bilangan orang',
  'Number of travellers': 'Bilangan pengembara',
  'Off the corridor': 'Di luar koridor',
  'On file': 'Dalam fail',
  'On rail accuracy': 'Tentang ketepatan rel',
  'Open admin queue': 'Buka baris gilir admin',
  'Open builder': 'Buka pembina',
  'Open details': 'Buka butiran',
  'Open enquiries': 'Buka pertanyaan',
  'Open listing': 'Buka penyenaraian',
  'Open operator portal': 'Buka portal operator',
  'Open queue': 'Buka baris gilir',
  Operator: 'Operator',
  'Operator name': 'Nama operator',
  'Operator not found': 'Operator tidak dijumpai',
  'Operator profile': 'Profil operator',
  Operators: 'Operator',
  Pending: 'Menunggu',
  'Pending review': 'Menunggu semakan',
  'Pending verification': 'Menunggu pengesahan',
  'Per station': 'Setiap stesen',
  Phone: 'Telefon',
  'Phone (mock)': 'Telefon (mock)',
  'Pick as many as you like. At least one.':
    'Pilih sebanyak yang anda suka. Sekurang-kurangnya satu.',
  'Preferences are stored in this browser only.': 'Keutamaan disimpan dalam pelayar ini sahaja.',
  'Preferred ETS station': 'Stesen ETS pilihan',
  'Preferred date': 'Tarikh pilihan',
  'Preferred station': 'Stesen pilihan',
  Price: 'Harga',
  'Price per person (MYR)': 'Harga setiap orang (MYR)',
  'Queue is clear': 'Baris gilir kosong',
  'Queue is clear.': 'Baris gilir kosong.',
  'Recent enquiries': 'Pertanyaan terkini',
  'Recorded in the audit log and shown to the operator.':
    'Direkod dalam log audit dan ditunjukkan kepada operator.',
  'Reset to saved': 'Set semula kepada yang disimpan',
  Review: 'Ulasan',
  'Review moderation': 'Moderasi ulasan',
  'Reviewer note (optional)': 'Nota penyemak (pilihan)',
  'SME discovery & enquiries by station': 'Penemuan PKS & pertanyaan mengikut stesen',
  'SME operator portal': 'Portal operator PKS',
  'Save changes': 'Simpan perubahan',
  'Save draft': 'Simpan draf',
  'Save these preferences': 'Simpan keutamaan ini',
  'Saved experiences': 'Pengalaman disimpan',
  'Search experiences…': 'Cari pengalaman…',
  'Search listings…': 'Cari penyenaraian…',
  'Search operators…': 'Cari operator…',
  'See all': 'Lihat semua',
  'See the impact model': 'Lihat model impak',
  'Send an enquiry': 'Hantar pertanyaan',
  'Send enquiry': 'Hantar pertanyaan',
  'Share is simulated. No public link is created and no data leaves this browser.':
    'Perkongsian disimulasikan. Tiada pautan awam dicipta dan tiada data keluar dari pelayar ini.',
  'Sign in': 'Log masuk',
  'Simulated reviews': 'Ulasan simulasi',
  'Simulated traffic pattern for the mockup.': 'Corak trafik simulasi untuk mockup.',
  'Six steps, in order': 'Enam langkah, mengikut urutan',
  Station: 'Stesen',
  'Station not found': 'Stesen tidak dijumpai',
  'Station sequence (north → south)': 'Urutan stesen (utara → selatan)',
  Status: 'Status',
  'Submit for verification': 'Hantar untuk pengesahan',
  'Submit review': 'Hantar ulasan',
  'Submitted for verification': 'Dihantar untuk pengesahan',
  'Submitting sends this listing to the admin queue with status':
    'Menghantar akan memasukkan penyenaraian ini ke baris gilir admin dengan status',
  'Tap the heart on any experience to keep it here for later.':
    'Tekan hati pada mana-mana pengalaman untuk simpan di sini.',
  "That page isn't on the ETS line. Head back to discovery and pick a station.":
    'Halaman itu tiada dalam laluan ETS. Kembali ke penemuan dan pilih stesen.',
  'That station is not part of the JOHOR360 demo corridor.':
    'Stesen itu bukan sebahagian daripada koridor demo JOHOR360.',
  'The corridor, geographically': 'Koridor, secara geografi',
  'The metrics that show whether attention is actually moving outside the city.':
    'Metrik yang menunjukkan sama ada perhatian benar-benar bergerak keluar dari bandar.',
  'The official question': 'Soalan rasmi',
  'The scoring model': 'Model pemarkahan',
  'This demo operator does not exist in the dataset.':
    'Operator demo ini tidak wujud dalam set data.',
  'This is what visitors see when they tap your business name.':
    'Inilah yang pelawat lihat apabila menekan nama perniagaan anda.',
  'This itinerary is empty': 'Itinerari ini kosong',
  'This listing may have been removed, or it is still awaiting admin verification.':
    'Penyenaraian ini mungkin telah dibuang, atau masih menunggu pengesahan admin.',
  'This operator has no verified public listings right now.':
    'Operator ini tiada penyenaraian awam yang disahkan sekarang.',
  'Three itineraries, sized to your window': 'Tiga itinerari, mengikut tetingkap masa anda',
  'Time, budget & station': 'Masa, bajet & stesen',
  'Top matches for you': 'Padanan terbaik untuk anda',
  'Total per person': 'Jumlah setiap orang',
  'Total views': 'Jumlah paparan',
  'Transport you will use for the last mile': 'Pengangkutan untuk batu terakhir',
  'Try a different filter, or create a new experience listing.':
    'Cuba penapis lain, atau cipta penyenaraian pengalaman baharu.',
  'Try another email': 'Cuba e-mel lain',
  'Try clearing the search or status filter.': 'Cuba kosongkan carian atau penapis status.',
  'Try the product': 'Cuba produk',
  'Update enquiry status': 'Kemas kini status pertanyaan',
  'Uploads are simulated — no files leave this browser.':
    'Muat naik disimulasikan — tiada fail keluar dari pelayar ini.',
  Verified: 'Disahkan',
  'Verified operator': 'Operator disahkan',
  'View all': 'Lihat semua',
  'View public profile': 'Lihat profil awam',
  'View station →': 'Lihat stesen →',
  'View → enquiry': 'Lihat → pertanyaan',
  'Visible to visitors on your operator page.':
    'Kelihatan kepada pelawat pada halaman operator anda.',
  'Visitor enquiries are not bookings. You keep control of the conversation.':
    'Pertanyaan pelawat bukan tempahan. Anda kekal mengawal perbualan.',
  'Welcome back. Pick up where you left off.':
    'Selamat kembali. Sambung dari tempat anda berhenti.',
  'What do you do, and who for? 30+ characters.':
    'Apa yang anda usahakan, dan untuk siapa? 30+ aksara.',
  'What is real in this mockup': 'Apa yang sebenar dalam mockup ini',
  'What is simulated': 'Apa yang disimulasikan',
  'What this dashboard is designed to prove': 'Apa yang papan pemuka ini direka untuk buktikan',
  'What we cover, and what we verified': 'Apa yang kami liputi, dan apa yang kami sahkan',
  'What we do not do': 'Apa yang kami tidak lakukan',
  'Write a review': 'Tulis ulasan',
  'Your feedback': 'Maklum balas anda',
  'Your itineraries': 'Itinerari anda',
  'Your listings': 'Penyenaraian anda',
  'Your matches': 'Padanan anda',
  'Your name': 'Nama anda',
  'Your setup so far': 'Persediaan anda setakat ini',
  'Your trip': 'Perjalanan anda',
}
