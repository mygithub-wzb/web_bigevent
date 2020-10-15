$(function () {
    // 获取文章类别列表
    getCateList()
    var layer = layui.layer;
    var form = layui.form;
    function getCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var addCate = null;
    $('#btnAddCate').on('click', function () {
        addCate = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        });
    })
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('添加分类失败')
                }
                layer.msg('添加分类成功');
                layer.close(addCate);
                getCateList()
            }
        })
    })
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // console.log('ok');
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('更改分类名称失败')
                }
                layer.msg('更改分类名称成功')
                layer.close(indexEdit)
                getCateList()
            }
        })
    })
    $('body').on('click', '.btn-remove', function () {
        // console.log('11');
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: res => {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    getCateList()
                }
            })
            layer.close(index);
        });
    })

})