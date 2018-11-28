
    $(document).ready(function() {
        hoverTitle();
        hoverContent();
    });
function hoverTitle() {
    let thDom = $("body").find('table');
    for (let i = 0; i < thDom.length; i++) {
        let dom = thDom.eq(i).find('thead').find('tr').find('th');
        for (let i = 0; i < dom.length; i++) {
            dom.eq(i).mouseover(function () {
                $(this).attr('title', $(this).text());
            })
            dom.eq(i).mouseover = null;
        }
        dom  == null;
    }
}
function hoverContent() {
    let tdDom = $("body").find('table');
    for (let i = 0; i < tdDom.length; i++) {
         let id = tdDom.eq(i).attr("id");
         if (id!=null && id!=undefined){
             hoverTableContent(id);
         }
    }

}

    /**
     * 传TableId
     * @param tableId
     */
    function hoverTableContent(tableId) {
        $("#"+tableId+"page-change.bs.table") ==null;
        $("#"+tableId).on('page-change.bs.table', function (e, number, size) {
            hoverPageChangeTableContent(tableId);
        });

        $("#"+tableId+"load-success.bs.table") ==null;
        $("#"+tableId).on('load-success.bs.table', function (e, number, size) {
            hoverLoadSuccessTableContent(tableId);
        });

    }

    function hoverPageChangeTableContent(tableId){
        setTimeout(function () {
            // 初始化之前释放之前的dom
            let dom = $("#"+tableId).find('tbody').find('tr');
            dom == null;
            initHover(tableId);
        },500);
    }

    function hoverLoadSuccessTableContent(tableId) {
        setTimeout(function () {
            // 初始化之前释放之前的dom
            let dom = $("#"+tableId).find('tbody').find('tr');
            dom == null;
            initHover(tableId);
        },500);
    }

    function initHover(tableId) {
        let dom = $("#"+tableId).find('tbody').find('tr').find('td');
        for (let i = 0; i < dom.length; i++) {
            dom.eq(i).mouseover(function () {
                $(this).attr('title', $(this).text());
            })
            $(this) == null;
            dom.eq(i).mouseover = null;
        }
        let titleDom = $("#"+tableId).find('thead').find('tr').find('th');
        for (let i = 0; i < titleDom.length; i++) {
            titleDom.eq(i).mouseover(function () {
                $(this).attr('title', $(this).text());
            })
            $(this) == null;
            titleDom.eq(i).mouseover = null;
        }

    }