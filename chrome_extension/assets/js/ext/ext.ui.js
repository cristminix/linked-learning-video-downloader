var mydragg = function() {
    return {
      
    }
  }();
Ext.ui = {
    
	html: `

<div id="__MalinkCorpSessionID__" style="display:none;" >

<div class="ui_title" style="" id="elem"><h4 style="font-size:90%;padding:0 0 6px 0">Lynda Course Downloader</h4></div>
<table class="ui_table table">
    <tbody>
        <tr>
            <th width="50px">Title</th><td><span class="course_title"></span></td>
            <th>Total</th><td><span class="total_videos"></span></td>
            <th>Current</th><td><span class="current_video"></span></td>
            <th>Idx</th><td><span class="current_index"></span></td>
            <th>Idx Chk</th><td><span class="chk_index"></span></td>
        </tr>
        <tr>
            <td colspan="5" class="btn-cnt"><button class="continue">Continue</button><button class="pause">Pause</button><button class="stop">Stop</button></td>
        </tr>
    </tbody>
</table>
<div class="ui_warning"><code></code></div>
<div class="ui_error"><code></code></div>

</div>
    `,
    move: function(divid, xpos, ypos) {
        divid.style.left = xpos + 'px';
        divid.style.top = ypos + 'px';
      },
      startMoving: function(divid, container, evt) {
        evt = evt || window.event;
        var posX = evt.clientX,
          posY = evt.clientY,
          divTop = divid.style.top,
          divLeft = divid.style.left,
          eWi = parseInt(divid.style.width),
          eHe = parseInt(divid.style.height),
          cWi = parseInt(document.body.style.width),
          cHe = parseInt(document.body.style.height);
        document.body.style.cursor = 'move';
        divTop = divTop.replace('px', '');
        divLeft = divLeft.replace('px', '');
        var diffX = posX - divLeft,
          diffY = posY - divTop;
        document.onmousemove = function(evt) {
          evt = evt || window.event;
          var posX = evt.clientX,
            posY = evt.clientY,
            aX = posX - diffX,
            aY = posY - diffY;
        //   if (aX < 0) aX = 0;
        //   if (aY < 0) aY = 0;
        //   if (aX + eWi > cWi) aX = cWi - eWi;
        //   if (aY + eHe > cHe) aY = cHe - eHe;
          Ext.ui.move(divid, posX, posY);
        }
      },
      stopMoving: function(container) {
        // var a = document.createElement('script');
        document.body.style.cursor = 'default';
        document.onmousemove = function() {}
      },
    applyUIStyle:()=>{
        setTimeout(()=>{
            $('#__MalinkCorpSessionID__').css({'font-size':'60%',height:'90px', position: 'absolute',padding:'1em',background:'#fff','text-align':'left','z-index':'10000','bottom':'1em',left:'39%',border:'solid 1px #000'})
            $('#__MalinkCorpSessionID__ .btn-cnt').css({padding:'6px 0 0em'});
            $('.btn-cnt > .continue,.btn-cnt > .pause,.btn-cnt > .stop').css({display:'none'});
            
        },1000);
    },
    constructUI:()=>{
        if($(`${Ext.manager.sessionKey}`).length == 0 && $('#__MalinkCorpSessionID__').length == 0){
            $(document.body).prepend(Ext.ui.html);
            Ext.ui.applyUIStyle();

            setTimeout(()=>{
                let el = $('#__MalinkCorpSessionID__');
                el.mousedown(()=>{Ext.ui.startMoving(el[0],"");});
                el.mouseup(()=>{Ext.ui.stopMoving("")});
            },100);
        }
    },
    showUI:()=>{
        setTimeout(()=>{
            // $('#__MalinkCorpSessionID__').fadeIn()
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

