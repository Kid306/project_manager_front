import PizZip from 'pizzip'
import docxtemplater from 'docxtemplater'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'
	//这里要引入处理图片的插件
	import ImageModule from 'docxtemplater-image-module-free';
	import expressions  from "angular-expressions"; 
	import { asBlob } from 'html-docx-js-typescript'

/**
 * 将base64格式的数据转为ArrayBuffer
 * @param {Object} dataURL base64格式的数据
 */
function base64DataURLToArrayBuffer(dataURL) {
	const base64Regex = /^data:image\/(png|jpg|jpeg|svg|svg\+xml);base64,/;
	if (!base64Regex.test(dataURL)) {
		return false;
	}
	const stringBase64 = dataURL.replace(base64Regex, "");
	let binaryString;
	if (typeof window !== "undefined") {
		binaryString = window.atob(stringBase64);
	} else {
		binaryString = new Buffer(stringBase64, "base64").toString("binary");
	}
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		const ascii = binaryString.charCodeAt(i);
		bytes[i] = ascii;
	}
	return bytes.buffer;
}
/**
 * 导出word,支持图片
 * @param {Object} tempDocxPath 模板文件路径
 * @param {Object} wordData 导出数据
 * @param {Object} fileName 导出文件名
 * @param {Object} imgSize 自定义图片尺寸
 */
export const exportWord = (tempDocxPath, wordData, fileName,imgSize) => {

	// 读取并获得模板文件的二进制内容
	JSZipUtils.getBinaryContent(tempDocxPath, function(error, content) {
		if (error) {
			throw error;
		}
		expressions.filters.size = function(input, width, height) {
			return {
				data: input,
				size: [width, height],
			};
		};
		function angularParser(tag) {
			const expr = expressions.compile(tag.replace(/’/g, "'"));
			return {
				get(scope) {
					return expr(scope);
				},
			};
		}
		// 图片处理
		let opts = {}
		opts = {
			//图像是否居中
			centered: true
		};
		opts.getImage = (chartId) => {
			//console.log(chartId);//base64数据
			//将base64的数据转为ArrayBuffer
			return base64DataURLToArrayBuffer(chartId);
		}
		opts.getSize = function(img, tagValue, tagName) {
			//自定义指定图像大小
			if(imgSize.hasOwnProperty(tagName)){
				return imgSize[tagName];
			}else{
				return [300, 300];
			}
		}
		// 创建一个PizZip实例，内容为模板的内容
		let zip = new PizZip(content);
		// 创建并加载docxtemplater实例对象
		let doc = new docxtemplater();
		doc.attachModule(new ImageModule(opts));
		doc.attachModule(new htmlToWord.HtmlToWordModule());

		doc.loadZip(zip);
		doc.setData(wordData);
		try {
			// 用模板变量的值替换所有模板变量
			doc.render();
		} catch (error) {
			// 抛出异常
			let e = {
				message: error.message,
				name: error.name,
				stack: error.stack,
				properties: error.properties
			};
			console.log(JSON.stringify({
				error: e
			}));
			throw error;
		}
		// 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
		let out = doc.getZip().generate({
			type: "blob",
			mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		});
		// 将目标文件对象保存为目标类型的文件，并命名
		saveAs(out, fileName);
	});
}
/**
 * 导出富文本到word,支持图片 
 * @param {Object} wordData 导出数据
 * @param {Object} fileName 导出文件名 
 */


export const html2Word=(htmlBody,fileName)=>{
	const html= `
	<!DOCTYPE html>
	<html>
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		</head>
		<body>
			 ${htmlBody}
		</body>
	</html>
	`
	asBlob(html).then(data => {
		saveAs(data, fileName) // 保存为 docx 文件
	}) // asBlob() return Promise<Blob|Buffer>
}
/**
 * 将图片的url路径转为base64路径
 * 可以用await等待Promise的异步返回
 * @param {Object} imgUrl 图片路径
 */
export function getBase64Sync(imgUrl) {	
	return new Promise(function(resolve, reject) {
		// 一定要设置为let，不然图片不显示
		let image = new Image();
		//图片地址
		image.src = imgUrl;
		// 解决跨域问题
		image.setAttribute("crossOrigin", '*');  // 支持跨域图片
		// image.onload为异步加载
		image.onload = function() {
			let canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;
			let context = canvas.getContext("2d");
			context.drawImage(image, 0, 0, image.width, image.height);
			//图片后缀名
			let ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();
			//图片质量
			let quality = 0.8;
			//转成base64
			let dataurl = canvas.toDataURL("image/" + ext, quality);
			//返回
			resolve(dataurl);
		};
	})
}