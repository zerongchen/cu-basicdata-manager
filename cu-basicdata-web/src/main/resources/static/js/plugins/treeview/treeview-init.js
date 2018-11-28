var DataSourceTree = function(options) {
	this._data 	= options.data;
	this._delay = options.delay;
}

DataSourceTree.prototype.data = function(options, callback) {
	var self = this;
	var $data = null;

	if(!("name" in options) && !("type" in options)){
		$data = this._data;//the root tree
		callback({ data: $data });
		return;
	}
	else if("type" in options && options.type == "folder") {
		if("additionalParameters" in options && "children" in options.additionalParameters)
			$data = options.additionalParameters.children;
		else $data = {}//no data
	}
	
	if($data != null)//this setTimeout is only for mimicking some random delay
		setTimeout(function(){callback({ data: $data });} , parseInt(Math.random() * 500) + 200);

	//we have used static data here
	//but you can retrieve your data dynamically from a server using ajax call
	//checkout examples/treeview.html and examples/treeview.js for more info
};

//数据展现方式有2种，第一种全部写在数据里面，additionalParameters下放子菜单级数，可以无限添加下去
var tree_data = {
	'for-sale' : {name: '<i class="titlebox fa fa-square-o"></i><span class="titleTest"> 广东省</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
		'appliances' : {name: '<span class="titleTest">深圳</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'arts-crafts' : {name: '<span class="titleTest">广州</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'clothing' : {name: '<span class="titleTest">佛山</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'computers' : {name: '<span class="titleTest">江门</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'jewelry' : {name: '<span class="titleTest">汕头</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'office-business' : {name: '<span class="titleTest">汕尾</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'sports-fitness' : {name: '<span class="titleTest">惠州</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}}	,
	'vehicles' : {name: '<span class="titleTest">Car</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
		'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
				'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
				'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
				'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
				'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
				'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
				'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
				'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
				'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
				'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
				'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
				'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
				'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
				'cars' : {name: '<span class="titleTest">Cars</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'folder','additionalParameters':{
	'children' : {
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'classics' : {name: '<span class="titleTest">Classics</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'convertibles' : {name: '<span class="titleTest">Convertibles</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'coupes' : {name: '<span class="titleTest">Coupes</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'hatchbacks' : {name: '<span class="titleTest">Hatchbacks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'hybrids' : {name: '<span class="titleTest">Hybrids</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'suvs' : {name: '<span class="titleTest">SUVs</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'sedans' : {name: '<span class="titleTest">Sedans</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'trucks' : {name: '<span class="titleTest">Trucks</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}},
		'motorcycles' : {name: '<span class="titleTest">Motorcycles</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'},
		'boats' : {name: '<span class="titleTest">Boats</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}
	}
}}	,
	'tickets' : {name: '<span class="titleTest">单选框</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}	,
	'services' : {name: '<span class="titleTest">checkbox</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>', type: 'item'}	,
	'personals' : {name: '<span class="titleTest">person</span><div class="tree-actions"><i class="fa fa-file-text-o" title="编辑"></i><i class="fa fa-edit" title="修改"></i><i class="fa fa-trash-o" title="删除"></i></div>',type: 'item'}
}
var treeDataSource = new DataSourceTree({data: tree_data});

//数据展现方式有2种，第二种以参数对接的方式展现出来，
var tree_data_2 = {
	'pictures' : {name: 'Pictures', type: 'folder', 'icon-class':'red'}	,
	'music' : {name: 'Music', type: 'folder', 'icon-class':'orange'}	,
	'video' : {name: 'Video', type: 'folder', 'icon-class':'blue'}	,
	'documents' : {name: 'Documents', type: 'folder', 'icon-class':'green'}	,
	'backup' : {name: 'Backup', type: 'folder'}	,
	'readme' : {name: '<i class="fa fa-file-text"></i> ReadMe.txt', type: 'item'},
	'manual' : {name: '<i class="fa fa-book"></i> Manual.html', type: 'item'}
}
tree_data_2['music']['additionalParameters'] = {
	'children' : [
		{name: '<i class="fa fa-music"></i> song1.ogg', type: 'item'},
		{name: '<i class="fa fa-music"></i> song2.ogg', type: 'item'},
		{name: '<i class="fa fa-music"></i> song3.ogg', type: 'item'},
		{name: '<i class="fa fa-music"></i> song4.ogg', type: 'item'},
		{name: '<i class="fa fa-music"></i> song5.ogg', type: 'item'}
	]
}
tree_data_2['video']['additionalParameters'] = {
	'children' : [
		{name: '<i class="fa fa-film"></i> movie1.avi', type: 'item'},
		{name: '<i class="fa fa-film"></i> movie2.avi', type: 'item'},
		{name: '<i class="fa fa-film"></i> movie3.avi', type: 'item'},
		{name: '<i class="fa fa-film"></i> movie4.avi', type: 'item'},
		{name: '<i class="fa fa-film"></i> movie5.avi', type: 'item'}
	]
}
tree_data_2['pictures']['additionalParameters'] = {
	'children' : {
		'wallpapers' : {name: 'Wallpapers', type: 'folder', 'icon-class':'pink'},
		'camera' : {name: 'Camera', type: 'folder', 'icon-class':'pink'}
	}
}
tree_data_2['pictures']['additionalParameters']['children']['wallpapers']['additionalParameters'] = {
	'children' : [
		{name: '<i class="fa fa-file-image-o"></i> wallpaper1.jpg', type: 'item'},
		{name: '<i class="fa fa-file-image-o"></i> wallpaper2.jpg', type: 'item'},
		{name: '<i class="fa fa-file-image-o"></i> wallpaper3.jpg', type: 'item'},
		{name: '<i class="fa fa-file-image-o"></i> wallpaper4.jpg', type: 'item'}
	]
}
tree_data_2['pictures']['additionalParameters']['children']['camera']['additionalParameters'] = {
	'children' : [
		{name: '<i class="fa fa-file-image-o"></i> photo1.jpg', type: 'item'},
		{name: '<i class="fa fa-file-image-o"></i> photo2.jpg', type: 'item'},
		{name: '<i class="fa fa-file-image-o"></i> photo3.jpg', type: 'item'},
		{name: '<i class="fa fa-file-image-o"></i> photo4.jpg', type: 'item'},
		{name: '<i class="fa fa-file-image-o"></i> photo5.jpg', type: 'item'},
		{name: '<i class="fa fa-file-image-o"></i> photo6.jpg', type: 'item'}
	]
}

tree_data_2['documents']['additionalParameters'] = {
	'children' : [
		{name: '<i class="fa fa-file-text"></i> document1.pdf', type: 'item'},
		{name: '<i class="fa fa-file-text"></i> document2.doc', type: 'item'},
		{name: '<i class="fa fa-file-text"></i> document3.doc', type: 'item'},
		{name: '<i class="fa fa-file-text"></i> document4.pdf', type: 'item'},
		{name: '<i class="fa fa-file-text"></i> document5.doc', type: 'item'}
	]
}
tree_data_2['backup']['additionalParameters'] = {
	'children' : [
		{name: '<i class="fa fa-archive"></i> backup1.zip', type: 'item'},
		{name: '<i class="fa fa-archive"></i> backup2.zip', type: 'item'},
		{name: '<i class="fa fa-archive"></i> backup3.zip', type: 'item'},
		{name: '<i class="fa fa-archive"></i> backup4.zip', type: 'item'}
	]
}
var treeDataSource2 = new DataSourceTree({data: tree_data_2});

    //数据调用
	$('#MyTree5').ace_tree({
			dataSource: treeDataSource , //传入的数据treeDataSource
			multiSelect:true, //是否可以多选，true或false
			loadingHTML:'<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',
			'open-icon' : 'fa-minus', //文件夹展开（加号）
			'close-icon' : 'fa-plus-square',//文件夹关闭（减号）
			'selectable' : true,  //item是否可以选择
			'selected-icon' : 'fa fa-check-square-o', //相当于选中时候的input框（用图标代替了）
			'unselected-icon' : 'fa fa-square-o'  //相当于input框（用图标代替了）
		});
		$('#MyTree4').ace_tree({
			dataSource: treeDataSource2 , //传入的数据treeDataSource
			multiSelect:true, //是否可以多选，true或false
			loadingHTML:'<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>',
			'open-icon' : 'fa-minus', //文件夹展开（加号）
			'close-icon' : 'fa-plus-square',//文件夹关闭（减号）
			'selectable' : true,  //item是否可以选择
			'selected-icon' : 'fa fa-check-square-o', //相当于选中时候的input框（用图标代替了）
			'unselected-icon' : 'fa fa-square-o'  //相当于input框（用图标代替了）
		});




