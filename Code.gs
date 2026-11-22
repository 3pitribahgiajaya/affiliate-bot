/**
 * BEN AI SHOPEE AFFILIATE - Google Apps Script
 * Versi starter lengkap: Sheets + konten + Telegram + Blogger + komisi manual.
 * Tidak menggunakan API tidak resmi Shopee.
 */
const BEN = {
  SHEETS: {
    Produk: ["ID","Tanggal Input","Nama Produk","Kategori","Harga (Rp)","Keunggulan","Target Pembeli","URL Produk","URL Affiliate Resmi","Status"],
    Konten: ["ID","Tanggal","Produk ID","Judul","Caption","Hashtag","Platform","Status","URL Publikasi","Catatan"],
    Klik: ["Tanggal","Produk ID","Sumber","Jumlah Klik","Catatan"],
    Komisi: ["Tanggal Laporan","Produk ID","Order ID","Penjualan (Rp)","Komisi (Rp)","Status Order","Catatan"],
    Pengaturan: ["Kunci","Nilai","Keterangan"],
    Log: ["Waktu","Aktivitas","Status","Detail"]
  }
};

function onOpen() {
  SpreadsheetApp.getUi().createMenu("BEN AI")
    .addItem("1. Siapkan Database", "setupBen")
    .addItem("2. Buat Konten dari Produk", "buatKonten")
    .addItem("3. Kirim Konten Disetujui ke Telegram", "kirimTelegram")
    .addItem("4. Terbitkan Konten Disetujui ke Blogger", "terbitkanBlogger")
    .addItem("5. Perbarui Dashboard", "perbaruiDashboard")
    .addToUi();
}

function setupBen() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(BEN.SHEETS).forEach(name => {
    let sh = ss.getSheetByName(name) || ss.insertSheet(name);
    sh.clear();
    sh.getRange(1,1,1,BEN.SHEETS[name].length).setValues([BEN.SHEETS[name]]);
    sh.getRange(1,1,1,BEN.SHEETS[name].length).setFontWeight("bold").setBackground("#123B63").setFontColor("#FFFFFF");
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, BEN.SHEETS[name].length);
  });
  const p = ss.getSheetByName("Pengaturan");
  p.getRange(2,1,5,3).setValues([
    ["TELEGRAM_BOT_TOKEN","","Isi token bot dari BotFather; jangan bagikan."],
    ["TELEGRAM_CHAT_ID","","ID channel/grup Telegram tujuan."],
    ["BLOGGER_BLOG_ID","","ID numerik blog Blogger."],
    ["BLOGGER_LABEL","Shopee Affiliate","Label posting Blogger."],
    ["DEFAULT_HASHTAG","#ShopeeAffiliate #RekomendasiProduk","Hashtag default"]
  ]);
  logBen_("Setup database","OK","Enam sheet BEN AI disiapkan.");
  SpreadsheetApp.getUi().alert("Database BEN AI siap. Isi sheet Produk dan Pengaturan.");
}

function getSetting_(key) {
  const sh=SpreadsheetApp.getActive().getSheetByName("Pengaturan");
  if (!sh) throw new Error("Jalankan menu BEN AI > Siapkan Database dahulu.");
  const v=sh.getDataRange().getValues();
  for(let i=1;i<v.length;i++) if(String(v[i][0]).trim()===key) return String(v[i][1]||"").trim();
  return "";
}
function logBen_(activity,status,detail) {
  const sh=SpreadsheetApp.getActive().getSheetByName("Log");
  if(sh) sh.appendRow([new Date(),activity,status,String(detail)]);
}
function uid_(){ return "BEN-"+Utilities.getUuid().slice(0,8).toUpperCase(); }

function buatKonten() {
  const ss=SpreadsheetApp.getActive(), ps=ss.getSheetByName("Produk"), cs=ss.getSheetByName("Konten");
  if(!ps || !cs) throw new Error("Jalankan Siapkan Database dahulu.");
  const rows=ps.getDataRange().getValues(); let made=0;
  for(let i=1;i<rows.length;i++){
    const r=rows[i]; const productId=r[0], name=r[2], category=r[3], price=r[4], benefits=r[5], audience=r[6], affiliate=r[8], status=r[9];
    if(!name || status==="Nonaktif") continue;
    const title="Rekomendasi "+name+" untuk "+(audience||"kebutuhan sehari-hari");
    const caption="Sedang mencari "+name+"? Produk kategori "+(category||"pilihan")+" ini bisa dipertimbangkan. "+
      (benefits ? "Keunggulan: "+benefits+". " : "")+
      (price ? "Harga yang tercatat: Rp"+Number(price).toLocaleString("id-ID")+". " : "")+
      "Cek detail, ulasan, harga terbaru, dan ketersediaan melalui tautan resmi berikut: "+(affiliate||"[MASUKKAN LINK AFFILIATE RESMI]")+
      "\n\nCatatan: harga dan stok dapat berubah. Periksa detail sebelum membeli.";
    const hashtags=getSetting_("DEFAULT_HASHTAG") || "#ShopeeAffiliate #RekomendasiProduk";
    cs.appendRow([uid_(),new Date(),productId,title,caption,hashtags,"Telegram","Menunggu Review","","Periksa klaim, harga, dan link sebelum menyetujui."]);
    cs.appendRow([uid_(),new Date(),productId,title,caption,hashtags,"Blogger","Menunggu Review","","Periksa klaim, harga, dan link sebelum menyetujui."]);
    made+=2;
  }
  logBen_("Buat konten","OK",made+" draft dibuat.");
  SpreadsheetApp.getUi().alert(made+" draft konten dibuat. Periksa sheet Konten dan ubah Status menjadi Disetujui setelah review.");
}

function kirimTelegram() {
  const token=getSetting_("TELEGRAM_BOT_TOKEN"), chat=getSetting_("TELEGRAM_CHAT_ID");
  if(!token || !chat) throw new Error("Lengkapi TELEGRAM_BOT_TOKEN dan TELEGRAM_CHAT_ID di Pengaturan.");
  const sh=SpreadsheetApp.getActive().getSheetByName("Konten"), data=sh.getDataRange().getValues();
  let sent=0;
  for(let i=1;i<data.length;i++){
    const r=data[i];
    if(r[6]!=="Telegram" || r[7]!=="Disetujui") continue;
    const textMsg="*"+r[3]+"*\n\n"+r[4]+"\n\n"+(r[5]||"");
    const url="https://api.telegram.org/bot"+token+"/sendMessage";
    const resp=UrlFetchApp.fetch(url,{method:"post",contentType:"application/json",payload:JSON.stringify({chat_id:chat,text:textMsg,parse_mode:"Markdown"}),muteHttpExceptions:true});
    const result=JSON.parse(resp.getContentText());
    if(result.ok){ sh.getRange(i+1,8).setValue("Terkirim"); sh.getRange(i+1,9).setValue(result.result.message_id); sent++; }
    else { sh.getRange(i+1,10).setValue("Telegram error: "+resp.getContentText()); }
  }
  logBen_("Kirim Telegram","OK",sent+" konten terkirim.");
  SpreadsheetApp.getUi().alert(sent+" konten terkirim ke Telegram.");
}

function terbitkanBlogger() {
  const blogId=getSetting_("BLOGGER_BLOG_ID");
  if(!blogId) throw new Error("Isi BLOGGER_BLOG_ID pada sheet Pengaturan.");
  const sh=SpreadsheetApp.getActive().getSheetByName("Konten"), data=sh.getDataRange().getValues();
  let published=0;
  for(let i=1;i<data.length;i++){
    const r=data[i];
    if(r[6]!=="Blogger" || r[7]!=="Disetujui") continue;
    const html="<h2>"+escapeHtml_(r[3])+"</h2><p>"+escapeHtml_(r[4]).replace(/\n/g,"<br>")+"</p><p><b>"+escapeHtml_(r[5]||"")+"</b></p><p><small>Konten promosi/afiliasi. BEN AI dapat memperoleh komisi dari pembelian melalui tautan afiliasi.</small></p>";
    try {
      const post=Blogger.Posts.insert({kind:"blogger#post",title:r[3],content:html,labels:[getSetting_("BLOGGER_LABEL")||"Shopee Affiliate"]},blogId);
      sh.getRange(i+1,8).setValue("Terbit");
      sh.getRange(i+1,9).setValue(post.url||"");
      published++;
    } catch(e) {
      sh.getRange(i+1,10).setValue("Blogger error: "+e.message);
    }
  }
  logBen_("Terbitkan Blogger","OK",published+" posting diterbitkan.");
  SpreadsheetApp.getUi().alert(published+" posting diterbitkan. Jika gagal, periksa Advanced Google Services dan akses Blogger.");
}
function escapeHtml_(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

function perbaruiDashboard() {
  const ss=SpreadsheetApp.getActive();
  let sh=ss.getSheetByName("Dashboard")||ss.insertSheet("Dashboard");
  sh.clear();
  const count=(name)=>Math.max(0,ss.getSheetByName(name).getLastRow()-1);
  const kom=ss.getSheetByName("Komisi").getDataRange().getValues();
  let total=0; for(let i=1;i<kom.length;i++) total+=Number(kom[i][4]||0);
  sh.getRange("A1:B6").setValues([
    ["BEN AI SHOPEE AFFILIATE","Ringkasan"],
    ["Total Produk",count("Produk")],
    ["Total Draft Konten",count("Konten")],
    ["Total Data Klik",count("Klik")],
    ["Total Baris Komisi",count("Komisi")],
    ["Total Komisi Tercatat (Rp)",total]
  ]);
  sh.getRange("A1:B1").setFontWeight("bold").setBackground("#123B63").setFontColor("#FFFFFF");
  sh.getRange("B6").setNumberFormat('"Rp" #,##0');
  sh.autoResizeColumns(1,2);
  logBen_("Perbarui dashboard","OK","Dashboard diperbarui.");
}

function getDashboardData(){
  const ss=SpreadsheetApp.getActive();
  const n=name=>Math.max(0,ss.getSheetByName(name).getLastRow()-1);
  const rows=ss.getSheetByName("Komisi").getDataRange().getValues();
  let sum=0; for(let i=1;i<rows.length;i++) sum+=Number(rows[i][4]||0);
  return {"Produk":n("Produk"),"Konten":n("Konten"),"Data Klik":n("Klik"),"Komisi tercatat":"Rp "+sum.toLocaleString("id-ID")};
}
function doGet(){ return HtmlService.createHtmlOutputFromFile("Dashboard").setTitle("BEN AI Affiliate Dashboard"); }
