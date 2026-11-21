const CFG={PRODUCTS:'Produk',LOG:'Log',DISCLOSURE:'Tautan affiliate: saya dapat memperoleh komisi jika Anda membeli melalui tautan ini sesuai ketentuan program Shopee Affiliate.'};

function onOpen(){SpreadsheetApp.getUi().createMenu('BEN AFFILIATE').addItem('Siapkan database','setupBenAffiliate').addItem('Uji posting sekarang','processQueue').addItem('Aktifkan jadwal harian','installDailyTrigger').addItem('Hentikan jadwal','removeBenTriggers').addToUi();}

function setupBenAffiliate(){
 const ss=SpreadsheetApp.getActiveSpreadsheet();
 let sh=ss.getSheetByName(CFG.PRODUCTS)||ss.insertSheet(CFG.PRODUCTS); sh.clear();
 sh.appendRow(['Nama Produk','Harga Referensi','Link Affiliate','Poin Produk (fakta)','URL Foto','Status','Tanggal Jadwal','Kanal (BLOGGER,TELEGRAM,FACEBOOK)','Judul Konten','Teks Promosi','Status Blogger','Status Telegram']);
 sh.appendRow(['Pembersih Lantai Aroma Jeruk Lemon 500 ml','Rp39.998','https://s.shopee.co.id/1qdmaopZ7w','Aroma jeruk lemon; ukuran 500 ml (cek ulang halaman produk)','','DRAFT','','BLOGGER,TELEGRAM','Pembersih Lantai Aroma Jeruk Lemon 500 ml','Lihat detail, variasi, harga, dan ulasan terbaru di Shopee.','','']);
 sh.setFrozenRows(1); sh.getRange(1,1,1,12).setFontWeight('bold').setBackground('#dff1e8');
 let lg=ss.getSheetByName(CFG.LOG)||ss.insertSheet(CFG.LOG); lg.clear(); lg.appendRow(['Waktu','Baris','Kanal','Hasil','Detail']);
 SpreadsheetApp.getUi().alert('Database dibuat. Isi Script Properties, cek produk, lalu ubah status menjadi READY.');
}

function installDailyTrigger(){removeBenTriggers();ScriptApp.newTrigger('processQueue').timeBased().everyDays(1).atHour(9).create();SpreadsheetApp.getUi().alert('Jadwal harian sekitar pukul 09.00 dibuat.');}
function removeBenTriggers(){ScriptApp.getProjectTriggers().forEach(t=>{if(t.getHandlerFunction()==='processQueue')ScriptApp.deleteTrigger(t);});}

function processQueue(){
 const sh=SpreadsheetApp.getActive().getSheetByName(CFG.PRODUCTS); if(!sh)throw Error('Jalankan setupBenAffiliate dahulu.');
 const rows=sh.getDataRange().getValues(); let done=0;
 for(let i=1;i<rows.length&&done<1;i++){
  const r=rows[i],name=String(r[0]||'').trim(),url=String(r[2]||'').trim(),status=String(r[5]||'').toUpperCase(),when=r[6]?new Date(r[6]):null,channels=String(r[7]||'BLOGGER,TELEGRAM').toUpperCase(),title=String(r[8]||name),promo=String(r[9]||'');
  if(!name||!url||status!=='READY'||(when&&when>new Date()))continue;
  if(!/^https:\/\/s\.shopee\.co\.id\//i.test(url)){sh.getRange(i+1,6).setValue('CHECK_LINK');log(i+1,'VALIDASI','DITOLAK','Gunakan link Shopee Affiliate resmi.');continue;}
  let ok=0;
  if(channels.includes('BLOGGER')&&String(r[10]).toUpperCase()!=='PUBLISHED'){try{blogger(title,html(name,r[1],url,r[3],promo));sh.getRange(i+1,11).setValue('PUBLISHED');log(i+1,'BLOGGER','BERHASIL',title);ok++;}catch(e){sh.getRange(i+1,11).setValue('ERROR');log(i+1,'BLOGGER','GAGAL',e.message);}}
  if(channels.includes('TELEGRAM')&&String(r[11]).toUpperCase()!=='SENT'){try{telegram(tg(name,r[1],url,promo));sh.getRange(i+1,12).setValue('SENT');log(i+1,'TELEGRAM','BERHASIL',title);ok++;}catch(e){sh.getRange(i+1,12).setValue('ERROR');log(i+1,'TELEGRAM','GAGAL',e.message);}}
  if(channels.includes('FACEBOOK')){try{facebook(title+'\n'+promo+'\n'+url+'\n'+CFG.DISCLOSURE);log(i+1,'FACEBOOK','BERHASIL',title);ok++;}catch(e){log(i+1,'FACEBOOK','GAGAL',e.message);}}
  if(ok)sh.getRange(i+1,6).setValue('POSTED');done++;
 }
}
function esc(s){return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function html(n,p,u,pts,promo){return '<h2>'+esc(n)+'</h2>'+(p?'<p>Harga referensi: '+esc(p)+'</p>':'')+(pts?'<p>'+esc(pts).replace(/;/g,'<br>')+'</p>':'')+(promo?'<p>'+esc(promo)+'</p>':'')+'<p><a href="'+esc(u)+'">Lihat produk di Shopee</a></p><p><small>'+esc(CFG.DISCLOSURE)+'</small></p><p><small>Harga, stok, dan promo dapat berubah. Periksa halaman penjual.</small></p>';}
function tg(n,p,u,promo){return '<b>'+esc(n)+'</b>\n'+(p?'Harga referensi: '+esc(p)+'\n':'')+(promo?esc(promo)+'\n':'')+'🛒 <a href="'+u+'">Cek produk di Shopee</a>\n\n<i>'+esc(CFG.DISCLOSURE)+'</i>';}

function blogger(title,content){
 const pr=PropertiesService.getScriptProperties(),blogUrl=pr.getProperty('BLOGGER_BLOG_URL');if(!blogUrl)throw Error('Isi BLOGGER_BLOG_URL di Script Properties.');
 const token=ScriptApp.getOAuthToken(),lookup=UrlFetchApp.fetch('https://www.googleapis.com/blogger/v3/blogs/byurl?url='+encodeURIComponent(blogUrl),{headers:{Authorization:'Bearer '+token},muteHttpExceptions:true});
 if(lookup.getResponseCode()!==200)throw Error('Blogger lookup: '+lookup.getContentText());
 const id=JSON.parse(lookup.getContentText()).id,res=UrlFetchApp.fetch('https://www.googleapis.com/blogger/v3/blogs/'+id+'/posts/',{method:'post',contentType:'application/json',headers:{Authorization:'Bearer '+token},payload:JSON.stringify({kind:'blogger#post',title,content}),muteHttpExceptions:true});
 if(res.getResponseCode()<200||res.getResponseCode()>=300)throw Error(res.getContentText());
}
function telegram(message){
 const p=PropertiesService.getScriptProperties(),token=p.getProperty('TELEGRAM_BOT_TOKEN'),chat=p.getProperty('TELEGRAM_CHAT_ID');if(!token||!chat)throw Error('Isi TELEGRAM_BOT_TOKEN dan TELEGRAM_CHAT_ID.');
 const r=UrlFetchApp.fetch('https://api.telegram.org/bot'+token+'/sendMessage',{method:'post',contentType:'application/json',payload:JSON.stringify({chat_id:chat,text:message,parse_mode:'HTML',disable_web_page_preview:false}),muteHttpExceptions:true}),b=JSON.parse(r.getContentText());if(!b.ok)throw Error(b.description||'Telegram API error');
}
function facebook(message){
 const p=PropertiesService.getScriptProperties(),id=p.getProperty('FACEBOOK_PAGE_ID'),token=p.getProperty('FACEBOOK_PAGE_ACCESS_TOKEN'),v=p.getProperty('META_GRAPH_VERSION')||'v22.0';if(!id||!token)throw Error('Facebook Page credentials belum diatur.');
 const r=UrlFetchApp.fetch('https://graph.facebook.com/'+v+'/'+id+'/feed',{method:'post',payload:{message,access_token:token},muteHttpExceptions:true}),b=JSON.parse(r.getContentText());if(r.getResponseCode()<200||r.getResponseCode()>=300||b.error)throw Error(b.error?.message||r.getContentText());
}
function log(row,ch,result,detail){SpreadsheetApp.getActive().getSheetByName(CFG.LOG).appendRow([new Date(),row,ch,result,detail]);}
