$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 请求文章数据列表
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    getTable()
    // 获取文章列表
    function getTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // layer.msg('获取文章列表成功')
                // 获取文章列表完成后渲染分页,把数据条数传给分页方法
                initPages(res.total)
            }
        })
    }
    // 时间过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        var y = dt.getFullYear()
        var m = addZero(dt.getMonth() + 1)
        var d = addZero(dt.getDate())

        var hh = addZero(dt.getHours())
        var mm = addZero(dt.getMinutes())
        var ss = addZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 补0方法
    function addZero(n) {
        return n > 9 ? n : '0' + n;
    }

    initCate()
    // 获取分类列表并重新加载页面
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 重新加载页面
                form.render()
            }
        })
    }
    // 筛选数据部分
    $('#form-search').on('submit', e => {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        // 筛选完成重新加载文章列表
        getTable()
    })

    // 分页
    function initPages(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数
                // console.log(obj.curr); 得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); 得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 直接调用会形成死循环,页面加载执行getTable(),getTable()又执行initPages(),initPages()又执行getTable()
                if (!first) {
                    //do something
                    getTable()
                }
            }
        });
    }

    // 列表文章删除功能
    $('tbody').on('click', '.btn-remove', function () {
        // console.log('11');
        var len = $('.btn-remove').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: res => {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    if (len == 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    getTable()
                }
            })
            layer.close(index);
        });
    })
})