let caches={
    courseTitles:{}
};
function makeTitle(slug) {
  var words = slug.split('-');

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return words.join(' ');
}
const cellCourseTitle = (data, type, row)=>{
    const key = `courseId_${data}`;
    if(typeof caches.courseTitles[key] != 'undefined'){
        return caches.courseTitles[key];
    }
    axios.get(`http://127.0.0.1:5000/course/${data}`).then((r)=>{
         caches.courseTitles[key] = makeTitle(r.data.courseTitle);
        $(`span.${key}`).text(caches.courseTitles[key])
    }).then((r)=>{
        console.log(r)
    });

    return `<span class="${key}">${data}</span>`;
    // console.log(data)
};

$(document).ready(function() {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var target = $(e.target).attr("href");
      console.log(target)
    });
    $("#clients_list").dataTable({
        serverSide: true,
        processing: true,
        ajax: "http://127.0.0.1:5000/data",
        columns: [
            {
                data: "id",
                "render": function(data, type, row){
                    return $("<div>").append($("<a/>").attr("href", row.DT_RowData.link).text(data)).html();
                }
            },
            { data: "name" },
            { data: "address" }
        ]
    });
    $('#session_list').dataTable({
        serverSide: true,
        processing: true,
        ajax: "http://127.0.0.1:5000/datatables/sessions",
        columns: [
            {
                data: "id",
                "render": function(data, type, row){
                    return $("<div>").append($("<a/>").attr("href", row.DT_RowData.link).text(data)).html();
                },visible:false
            },
            { data: "sessionId" },
            { data: "createDate" ,"render":(data,type,row)=>{return moment(data).fromNow()}}
        ]
    });
    var taskGroupColumn = 2;
    $('#tasks_list').dataTable({
        "columnDefs": [
            { "visible": false, "targets": taskGroupColumn }
        ],
        serverSide: true,
        processing: true,
        ajax: "http://127.0.0.1:5000/datatables/tasks",
        columns: [
            {
                data: "id",
                "render": function(data, type, row){
                    return $("<div>").append($("<a/>").attr("href", row.DT_RowData.link).text(data)).html();
                },visible:false
            },
            { data: "name" },
            { data: "sessionId" },
            { data: "courseId" },
            // { data: "courseTitle" },
            { data: "param" ,visible:false},
            { data: "status" ,visible:false},
            { data: "createDate" ,"render":(data,type,row)=>{return moment(data).fromNow()}}
        ],
         "columnDefs": [
            { "visible": false, "targets": taskGroupColumn }
        ],
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
 
            api.column(taskGroupColumn, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group"><td colspan="5">'+group+'</td></tr>'
                    );
 
                    last = group;
                }
            } );
        }
    });
    var courseGroupColumn = 1;

    $('#course_list').dataTable({
        serverSide: true,
        processing: true,
        ajax: "http://127.0.0.1:5000/datatables/courses",
        columns: [
            {
                data: "id",visible:false
            },
            { data: "sessionId"},
            { data: "coursePath" ,visible:false},
            { data: "courseTitle","render":(data)=>{return makeTitle(data)} },
            { data: "url" ,visible:false},
            { data: "hostname" ,visible:false},
            { data: "createDate" ,"render":(data,type,row)=>{return moment(data).fromNow()}} 
           
        ],
        "columnDefs": [
            { "visible": false, "targets": courseGroupColumn }
        ],
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
 
            api.column(courseGroupColumn, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group"><td colspan="5">'+group+'</td></tr>'
                    );
 
                    last = group;
                }
            } );
        }
    });
    let tocGroupColumn = 1;
    $('#toc_list').dataTable({
        serverSide: true,
        processing: true,
        ajax: "http://127.0.0.1:5000/datatables/tocs",
        columns: [
            {
                data: "id", visible:false
                
            },
            { data: "courseId" },
            { data: "idx" , visible:false},
            { data: "title","render": function(data, type, row){
                    return `${row.idx+1}. ${data}`;
                } },
            { data: "captionUrl", visible:false },
            { data: "duration" },
            { data: "posterUrl" , visible:false},
            { data: "slug" , visible:false},
            
            { data: "url" , visible:false},
            { data: "videoUrl", visible:false },
            { data: "createDate" ,"render":(data,type,row)=>{return moment(data).fromNow()}} 
           
        ],
        "columnDefs": [
            { "visible": false, "targets": tocGroupColumn }
        ],
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
 
            api.column(tocGroupColumn, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group"><td colspan="5">'+cellCourseTitle(group)+'</td></tr>'
                    );
 
                    last = group;
                }
            } );
        }

    });
});

const namespace = 'http://127.0.0.1:5000';
var socket = io(namespace);

socket.on('connect', function() {
    console.log('connected to the SocketServer...');
});

socket.on('toc_download', function(msg, cb) {
    // console.log(msg)
    const progress = Math.floor((msg.progress/msg.total)*100)
    $(`.statusTocId-${msg.tocId}`).text(`${progress} %`);
    $(`.sizeTocId-${msg.tocId}`).text(`${Math.ceil(msg.total/1024)}`);
});