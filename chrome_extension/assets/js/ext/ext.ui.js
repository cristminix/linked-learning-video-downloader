Ext.ui = {
	html: `
<div id="__MalinkCorpSessionID__" style="display:none">
<div class="ui_title"><h4 style="font-size:90%;padding:0 0 6px 0">Lynda Course Downloader</h4></div>
<table class="ui_table table">
    <tbody>
        <tr>
            <th width="50px">Title</th><td><span class="course_title"></span></td>
        </tr>
        <tr>    
            <th>Total</th><td><span class="total_videos"></span></td>
        </tr>
        <tr>
            <th>Current</th><td><span class="current_video"></span></td>
        </tr>
        <tr>
            <th>Idx</th><td><span class="current_index"></span></td>
        </tr>
        <tr>
            <th>Idx Chk</th><td><span class="chk_index"></span></td>
        </tr>
        <tr>
            <td colspan="2" class="btn-cnt"><button class="continue">Continue</button><button class="pause">Pause</button><button class="stop">Stop</button></td>
        </tr>
    </tbody>
</table>
<div class="ui_warning"><code></code></div>
<div class="ui_error"><code></code></div>

</div>
    `,
    applyUIStyle:()=>{
        setTimeout(()=>{
            $('#__MalinkCorpSessionID__').css({'font-size':'60%', position: 'absolute',padding:'1em',background:'#fff','text-align':'left','z-index':'10000','bottom':'1em',left:'39%',border:'solid 1px #000'})
            $('#__MalinkCorpSessionID__ .btn-cnt').css({padding:'6px 0 0em'});
            $('.btn-cnt > .continue,.btn-cnt > .pause,.btn-cnt > .stop').css({display:'none'});
            
        },1000);
    },
    constructUI:()=>{
        if($(`${Ext.manager.sessionKey}`).length == 0 && $('#__MalinkCorpSessionID__').length == 0){
            $(document.body).prepend(Ext.manager.UI.html);
            Ext.manager.UI.applyUIStyle();
        }
    },
    showUI:()=>{
        setTimeout(()=>{
            $('#__MalinkCorpSessionID__').fadeIn()
        },500);
    },
    hideUI:()=>{
        setTimeout(()=>{
            $('#__MalinkCorpSessionID__').fadeOut()
        },500);
    },
    setCourseTitle:(title)=>{
        $(`#${Ext.manager.sessionKey} .course_title`).text(title);
    },
    setTotalVideos:(title)=>{
        $(`#${Ext.manager.sessionKey} .total_videos`).text(title);
    },
    setCurrentVideo:(title)=>{
        $(`#${Ext.manager.sessionKey} .current_video`).text(title);
    },
    setCurrentIndex:(title)=>{
        $(`#${Ext.manager.sessionKey} .current_index`).text(title+1);
    },
    setChkIndex:(title)=>{
        $(`#${Ext.manager.sessionKey} .chk_index`).text(title);
    },
    waning:(message)=>{
        setTimeout(()=>{
            $(`#${Ext.manager.sessionKey} .ui_warning code`).text(message);
        },3000);
    },
    error:(message)=>{
        setTimeout(()=>{
            $(`#${Ext.manager.sessionKey} .ui_error code`).text(message);
        },3000);
    }
};