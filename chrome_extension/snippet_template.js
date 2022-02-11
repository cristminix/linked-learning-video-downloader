/**
 * Clicking Anchor
 * */

// 
// const a = $("a[href='"+url+"']");
// a[0].click()
const tocs = Ext.manager.getToc();
for(let i=0; i < tocs.length;i++){
	const toc = tocs[i];
	const url = toc.origLinkUrl;
	const a = $("a[href='"+url+"']");
	if(a.length>0){
		// a.trigger('click');
		setTimeout(()=>{
			a[0].click()
		},5000); 
		break;
	}
}