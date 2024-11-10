//////////////Start
/*


*/
myfunc();




function myfunc() 
{
 
 	 csvpath = 'c:\\work\\_stickers\\';
	 task_fn = 'stask.csv';
	 task_fn_xlsx = 'stask.xlsx';
	 exportpath =  'c:\\work\\_mockups';//'c:\\work';
	 
	 rules_fn = 'RulesTreatmentsLayers.csv';
	 
	 out_file_type = 'pdf';
	 var max_row = 10.0;
	 
	
	   // -------- initial coords block 	
		   var pt2mm = 2.83464567;
		   var dx = 70;//700
		   var dy = 70;//700
			
		   /* 
		   // big export
		   var x1 = -8020;
		   var y1 = 50;
			*/
			
			// normal export
		   var x1 = 120;
		   var y1 = 50;
		   
		   // text above sticker (quantity)
		   var myTextFrame;
		   var qtty_text = ' pcs.';
		   var x2 =  x1 - 20;
		   var y2 = y1+ 140;
	   
	  // ---------  end initial coords block
  
		// page size in points 
		var fX=85;
		var fY=280;
  
	 

	 // rules store in script path 
		var s = $.fileName;
		var script_path = s.slice(0, s.lastIndexOf('\\'))+'\\';
	 

    // 1. Создаем список подслоев, из которого делаем список правил для кадого слоя.
    // делается один раз.
    // Запись подслоев из родительского слоя в файл
    //SublayersToCsv(app.activeDocument.layers["GelPolishMain"].layers,'d:\\555666777.txt');
    //SublayersToCsv(app.activeDocument.layers["GelPolishGlitter"].layers,'d:\\555666777.txt');
	
	
	// Пока не доделал:
	// Родительский слой должен быть включен!


    //alert('Внимание! Должен быть открыт только документ с наклейками!');
	
	 var dds =  show_dialog(csvpath,task_fn,max_row);
	 if (dds['Exit']=='Yes')
	 { 
		 return;
	 }


	
    var thisDoc = app.documents.add(null,fX,fY);
	//thisDoc.views[0].zoom = 100;
    app.documents[1].activate();

    var csvRules;
    csvRules = File(script_path + rules_fn);
    var csvTask;
    csvTask = File(csvpath + task_fn);


    if (!csvRules.exists){ alert(csvRules + ' not exist'); return;}
    if (!csvTask.exists) { alert(csvTask  + '  not exist');return;}
   var fRules = Csv2Array(csvRules);
   var fTask = Csv2Array(csvTask);

   // 2024-03-05 sort by art
   // remove 1 row (header) 
   fTask.shift();
 
   var sortedArray = fTask.sort(function(a, b) {
			return b[0] - a[0];
	});
	fTask = sortedArray;

	// alert(fRules[1447][2]);
	// alert(fTask[1][0]);	
	// end sort by art


   //
   var t = new Array();
   var k = 0;
   var layer_not_in_rule = "";
   var flag_layer_not_in_rule = false;
   for (var i = 0; i < fTask.length; i++)
   {
	// alert(fTask[i])
	// alert(fRules[j][2])
           for (var j = 1; j < fRules.length; j++)
           {
               if (fTask[i][0] == fRules[j][2])
               {
				
				   if(doesLayerExist(fRules[j][0]) )
				   {
					   var data = new Array();
					   data.push(fTask[i][1]);
					   data.push(GetNumSublayer(fRules[j][0], fRules[j][1]));
					   data.push.apply(data,fRules[j]);
					   t[k] = data;
					   //if (i < 5) alert(t[k]);
					   k++;
					   flag_layer_not_in_rule = true;
				   }
               }
           }
		 if(!flag_layer_not_in_rule)
					{ 
						layer_not_in_rule +=fTask[i][0]+"\n";
						flag_layer_not_in_rule = false;
					}
   }

 // alert(t);
 // 2024-03-05 mike I forget, was it make. So, comment it.
 //t.sort(sort_by_col3);  
 //alert(t);
 //return;


// t - полный массив нужных слоев с количеством наклеек в конце.
// t[i][0] - кол - 8
// t[i][1] - numer sublayer - 9
// t[i][2] - родительский слой - 0
// t[i][4] - артикул - 2
// t[i][7], t[i][8] - dx, dy - 5,6
// t[i][9] - имя листа (Artboard name) - 7
// t[i][10] - sticker file name
// t[i][11] - sticker filder name


// old massiv.
// t[i][0] - родительский слой
// t[i][2] - артикул
// t[i][5], t[i][6] - dx, dy
// t[i][7] - имя листа (Artboard name)
// t[i][8] - кол
// t[i][9] - numer sublayer

   var ii = 1.0;
   var real_sticler_pasted = 0;
   var j = 1;
   for (var i in t) 
   {
	   try{
		       //app.activeDocument.selection = null; 
			   //app.copy();
			   app.activeDocument.layers[t[i][2]].layers[t[i][1]].visible = true;
			   setActiveArtboardBy(t[i][9]); // 7 - имя листа (Artboard name)
			   app.activeDocument.selectObjectsOnActiveArtboard();
			   
			  //  sleep(1000);
			  if(dds['NormalMode']=='DelayAuto'){ 
				var win = new Window('dialog', "Some title"); 
				win.buttons = win.add("group");
				win.buttons.alignment = "center";
				win.buttons.ok = win.buttons.add("button", undefined, "OK");
				win.buttons.cancel = win.buttons.add("button", undefined, "Cancel");
				win.show();
				win.buttons.cancel.onClick = function(){
            win.close();
        }


				win.close();
				//customAlert('Paste error mode', 0.5, t[i]); 
			}
			  //  
			  if(dds['NormalMode']=='DelayManual'){alert(t[i]);}
			  //if(dds['NormalMode']=='DelayManual2' && j % 2 == 0){alert(t[i]);}
			  //j++;
			  
			   app.copy();
			   //app.executeMenuCommand('Copy');

		
			   app.activeDocument.selection = null;
			   //app.executeMenuCommand('Deselect'); 
			   app.activeDocument.layers[t[i][2]].layers[t[i][1]].visible = false;
			   
			   app.documents[1].activate();//active=true;

			   if(dds['AddQtt']=='Yes'){
				if(t[i][0]!=0 || t[i][0]!="")
				{
					myTextFrame = app.activeDocument.textFrames.add();
					myTextFrame.position = [x2, y2];
					myTextFrame.contents = t[i][0] + qtty_text;
				}			   
			
				}


			   if(dds['ToOneFile']=='Yes'){
				   
					   app.activeDocument.views[0].centerPoint = Array(x1, y1);
					   //alert(t[i][5]);
					   dx = Number(t[i][7])*pt2mm; // convert mm to points
					   dy =  Number(t[i][8])*pt2mm + 40; // convert mm to points + points
					   
					  // располагать наклейки в ряд 
					 if(dds['LayerToRow']=='Yes' )
					 {  
						   if (ii%dds['max_row']==0)
						   {
							 y1-= dy;
							 y2-= dy;
							
							x1=x1 - dx * (dds['max_row'] -1) ;
							x2=x2 - dx * (dds['max_row'] -1 );
						   }
						   else{
							x1 +=dx; //t[i][5];//dx;
							x2 +=dx;//t[i][5]; //dx;
					   }
					 }
					 else { // располагать наклейки в столбик
					   y1+= dy;
					   y2+= dy; 
					 }
				}	   
			   
			   
			  
			   try {

					app.executeMenuCommand('paste'); 
					//app.duplicate();

					app.executeMenuCommand('group');
					
					aa2 = getBounds(app.activeDocument.selection);
					app.executeMenuCommand('ungroup');
					size_text1 =  aa2[0] + 'x'+ aa2[1]+'mm';
				  //app.executeMenuCommand('paste'); 
				}
				catch(err) {
				  alert("Paste/duplicate exception. Error name: "+ err.name + ", Error message: " + err.message );

				}
			  
			   if(dds['ToOneFile']=='No'){
					if(dds['AddQtt']=='Yes'){
						//aa2 = getBounds(app.activeDocument.selection);
						myTextFrame.contents += ' , size: '+ size_text1 ;
						for (i2 = 0; i2 < app.activeDocument.pageItems.length; i2++) {
							app.activeDocument.pageItems[i2].selected = true;
						}
						app.activeDocument.fitArtboardToSelectedArt(0); 
					}
					else{
						app.activeDocument.fitArtboardToSelectedArt(0);
					}
			   }
			   app.activeDocument.selection = null;

			   ii++;
			   real_sticler_pasted++;
			  // преобразовать текст в кривые? 
			   if(dds['TextToCurves']=='Yes')ExplodeAllText(app.activeDocument);
			   
			   if(dds['ToOneFile']=='No'){
				   // ds['exportpath']
				   // ds['AddFileInfo']
				   fname = t[i][4]
				   if(dds['AddFileInfo']=='Yes'){
					fname+= '_'+size_text1+'_'+t[i][0]+'pcs'
				   }
			   
				   Save2PdfNClose(app.activeDocument, dds['exportpath'] +'//' + fname,dds['ToPdf']);
				   app.documents.add(null,fX,fY);
				   //app.activeDocument.zoom = 100;
				   }
			   app.documents[1].activate();
			}
		catch(err) {
		  alert( err.name + " message: " + err.message );
		}
			   
	   
   }
 alert("Job done. \n Pasted stickers: "+ real_sticler_pasted
		+ "\n Stickers in task : " + (fTask.length)
		+ "\n Art not exist: \n"+ layer_not_in_rule);
}


function sort_by_col3(a,b){
	if (a[1] === b[1]) {
		return 0;
	}
	else {
		return (a[2] < b[2]) ? -1 : 1;
	}
}


// Работает некорректно. Нужно доработать.
// Быстрое решение - группировка объектов, вызов этой функции
// и разгруппировка после.
function getBounds ( arr ) {
	var k2 = 2.834648;// 2.83464567; 
	var x1 = [], y1 = [], w1 = [], h1 = []; //, bounds = bounds || 'geometricBounds';

	var logger = new File('c:\\work\\_mockups\\log1.txt');
	logger.open("a");
	//var writeLine = (line) => logger.write('\n${line}');
	logger.write('\n--------- new stisker -------------')
	logger.write('\nobjects qtty = ',arr.length)
    for ( var i = 0; i < arr.length; i++ ) 
		{
			x1.push(arr[i].left);
			y1.push(arr[i].top);
			w1.push(arr[i].width);
			h1.push(arr[i].height);
			logger.write( '\nh[',i,'] = ' ,Math.round(arr[i].height/k2))
		}
		
    x = Math.min.apply( null, x1 );
    y = Math.min.apply( null, y1 );
    w = Math.max.apply( null, w1 );
    h = Math.max.apply( null, h1 );
	logger.write( '\nx = ' ,Math.round(x/k2),', y = ', Math.round(y/k2),', w = ',Math.round(w/k2),', h = ', Math.round(h/k2))

	logger.close();
    return size = [ Math.round(w/k2), Math.round(h/k2) ];
}

// копия функции getBounds. На всякий. Если в будущем буду переделывать  getBounds
function get_max_obj_Bounds ( arr ) {
	var k2 = 2.834648;// 2.83464567; 
	var x1 = [], y1 = [], w1 = [], h1 = []; //, bounds = bounds || 'geometricBounds';

	var logger = new File('c:\\work\\_mockups\\log1.txt');
	logger.open("a");
	//var writeLine = (line) => logger.write('\n${line}');
	logger.write('\n--------- new stisker -------------')
	logger.write('\nobjects qtty = ',arr.length)
    for ( var i = 0; i < arr.length; i++ ) 
		{
			x1.push(arr[i].left);
			y1.push(arr[i].top);
			w1.push(arr[i].width);
			h1.push(arr[i].height);
			logger.write( '\nh[',i,'] = ' ,Math.round(arr[i].height/k2))
		}
		
    x = Math.min.apply( null, x1 );
    y = Math.min.apply( null, y1 );
    w = Math.max.apply( null, w1 );
    h = Math.max.apply( null, h1 );
	logger.write( '\nx = ' ,Math.round(x/k2),', y = ', Math.round(y/k2),', w = ',Math.round(w/k2),', h = ', Math.round(h/k2))

	logger.close();
    return size = [ Math.round(w/k2), Math.round(h/k2) ];
}


function show_dialog(csvpath,task_fn, max_row)
{
	var box = new Window('dialog', "Some title");  
	var ds = new Array();
    ds[0]='-nothing-';
  
		box.panel = box.add('panel', undefined, "Data file name with path:");  
		box.panel.csvpath = box.panel.add('edittext', undefined, csvpath);  
		box.panel.task_fn = box.panel.add('edittext', undefined, task_fn); 
		box.panel.orientation='row'; 
		// ------------------------------------------------------------------------------------		   
		 //box.TextToCurves = box.add('group', undefined, 'Path Objects Size:');
		 box.TextToCurves = box.add('panel', undefined, "Text to curves"); 
		// Radio Buttons for Larger than, or smaller than
		(box.TextToCurves.Yes = box.TextToCurves.add('radiobutton', undefined, 'Yes' )).helpTip = "text2curves"; 
		(box.TextToCurves.No = box.TextToCurves.add('radiobutton', undefined, 'No' )).helpTip = "text2text"; 

		box.TextToCurves.Yes.value = true; 
		box.TextToCurves.orientation='row'; 		  
		  
		// ------------------------------------------------------------------------------------	
		//box.AddQtt = box.add('group', undefined, 'Path Objects Size:');
		box.AddQtt = box.add('panel', undefined, "Add quantity"); 
		// Radio Buttons for Larger than, or smaller than
		(box.AddQtt.Yes = box.AddQtt.add('radiobutton', undefined, 'Yes' )).helpTip = "Add quantity"; 
		(box.AddQtt.No = box.AddQtt.add('radiobutton', undefined, 'No' )).helpTip = "Add quantity"; 

		box.AddQtt.Yes.value = true; 
		box.AddQtt.orientation='row'; 		  
		 
	   // ------------------------------------------------------------------------------------			
		 //box.ToOneFile = box.add('group', undefined, 'Path Objects Size:');
		 box.ToOneFile = box.add('panel', undefined, "All layers to one file"); 
		// Radio Buttons for Larger than, or smaller than
		(box.ToOneFile.Yes = box.ToOneFile.add('radiobutton', undefined, 'Yes' )).helpTip = "one file"; 
		(box.ToOneFile.No = box.ToOneFile.add('radiobutton', undefined, 'No' )).helpTip = "many files"; 

		box.ToOneFile.Yes.value = true; 
		box.ToOneFile.orientation='row'; 
	   // ------------------------------------------------------------------------------------			
		 box.AddFileInfo = box.add('panel', undefined, "Add info to filename?"); 
		// Radio Buttons for Larger than, or smaller than
		(box.AddFileInfo.Yes = box.AddFileInfo.add('radiobutton', undefined, 'Yes' )).helpTip = "Add qtty to file name"; 
		(box.AddFileInfo.No = box.AddFileInfo.add('radiobutton', undefined, 'No' )).helpTip = "file name = art"; 

		box.AddFileInfo.No.value = true; 
		box.AddFileInfo.orientation='row'; 
		// ------------------------------------------------------------------------------------				
		//box.ToPdf = box.add('group', undefined, 'Path Objects Size:');
		box.ToPdf = box.add('panel', undefined, "Export to:"); 
		// Radio Buttons for Larger than, or smaller than
		(box.ToPdf.Pdf = box.ToPdf.add('radiobutton', undefined, 'Pdf' )).helpTip = "2pdf"; 
		(box.ToPdf.Png = box.ToPdf.add('radiobutton', undefined, 'Png' )).helpTip = "2png"; 
		(box.ToPdf.Jpg = box.ToPdf.add('radiobutton', undefined, 'Jpg' )).helpTip = "2jpg"; 
		box.ToPdf.exportpath = box.add('edittext', undefined, exportpath);  

		box.ToPdf.Pdf.value = true; 
		box.ToPdf.orientation='row'; 			
		// ------------------------------------------------------------------------------------				
		 //box.LayerToRow = box.add('group', undefined, 'All to row:');
		box.LayerToRow = box.add('panel', undefined, "Все слои в ряд?"); 
		// Radio Buttons for Larger than, or smaller than
		(box.LayerToRow.Yes = box.LayerToRow.add('radiobutton', undefined, 'Yes' )).helpTip = "layers2row"; 
		(box.LayerToRow.No = box.LayerToRow.add('radiobutton', undefined, 'No' )).helpTip = "layers2column"; 

		box.LayerToRow.Yes.value = true; 
		box.LayerToRow.orientation='row'; 

		box.panel2 = box.add('panel', undefined, "Quantity in a row");  
		box.panel2.max_row = box.panel2.add('edittext', undefined, max_row);  
		box.panel2.orientation='row'; 
			
			
		// ------------------------------------------------------------------------------------		   
		 //box.NormalMode = box.add('group', undefined, 'Normal mode');
		 box.NormalMode = box.add('panel', undefined, "Select mode (if Error2 - select any delay ) :"); 
		// Radio Buttons for Larger than, or smaller than
		(box.NormalMode.Yes = box.NormalMode.add('radiobutton', undefined, 'Normal' )).helpTip = "normal mode"; 
		(box.NormalMode.Auto = box.NormalMode.add('radiobutton', undefined, 'Delay auto' )).helpTip = "delay mode auto"; 
		(box.NormalMode.Manual = box.NormalMode.add('radiobutton', undefined, 'Delay manual' )).helpTip = "delay mode manual"; 
		//(box.NormalMode.Manual2 = box.NormalMode.add('radiobutton', undefined, 'Delay manual 2st' )).helpTip = "delay mode manual every second"; 
		box.NormalMode.Yes.value = true; 
		box.NormalMode.orientation='row'; 		  
		  
		// ------------------------------------------------------------------------------------					
			
		// ------------------------------------------------------------------------------------	
		
		box.btns = box.add('group', undefined, 'buttons');
	    //  box.btns = box.add('panel', undefined, "___"); 

		box.btns.closeBtn=box.btns.add('button',undefined, "Start", {name:'close'});  
		box.btns.exitBtn=box.btns.add('button',undefined, "Exit", {name:'exit'});  
		box.btns.orientation='row'; 	
		
		box.btns.exitBtn.onClick = function(){ 
		ds['Exit']='Yes';
		box.close();

		}
		
		  
		box.btns.closeBtn.onClick = function(){ 
		
		
		if(box.ToOneFile.Yes.value == true)ds['ToOneFile']='Yes';
		if(box.ToOneFile.No.value == true)ds['ToOneFile']='No';	
		if(box.TextToCurves.Yes.value == true)ds['TextToCurves']='Yes';
		if(box.TextToCurves.No.value == true)ds['TextToCurves']='No';	
		if(box.ToPdf.Pdf.value == true)ds['ToPdf']='pdf';
		if(box.ToPdf.Png.value == true)ds['ToPdf']='png';	
		if(box.ToPdf.Jpg.value == true)ds['ToPdf']='jpg';		
		if(box.LayerToRow.Yes.value == true)ds['LayerToRow']='Yes';
		if(box.LayerToRow.No.value == true)ds['LayerToRow']='No';	
		if(box.NormalMode.Yes.value == true)ds['NormalMode']='Normal';
		if(box.NormalMode.Auto.value == true)ds['NormalMode']='DelayAuto';	
		if(box.NormalMode.Manual.value == true)ds['NormalMode']='DelayManual';	
		if(box.AddQtt.Yes.value == true)ds['AddQtt']='Yes';
		if(box.AddQtt.No.value == true)ds['AddQtt']='No';
		if(box.AddFileInfo.Yes.value == true)ds['AddFileInfo']='Yes';
		if(box.AddFileInfo.No.value == true)ds['AddFileInfo']='No';

		//if(box.NormalMode.Manual2.value == true)ds['NormalMode']='DelayManual2';
		
		ds['Exit']='No';
		ds['csvpath']=box.panel.csvpath.text;
		ds['task_fn']=box.panel.task_fn.text;
		ds['max_row'] = box.panel2.max_row.text;
		ds['exportpath'] = box.ToPdf.exportpath.text;
		
		  box.close();  
		}  
    box.show();
   return ds;
}



function doesLayerExist(name) {
	var layers=app.activeDocument.layers;
    for (i=0; i<layers.length; i++) {
        if (layers[i].name==name) return true;
    }
    return false;
}



// преобразовать текст в кривые
function ExplodeAllText(doc)
{
	   tfs = doc.textFrames;
	do{
	   if(tfs.length>=1)tfs[0].createOutline();
		else break;
	}while(tfs.length);
}



function setActiveArtboardBy(name) {
    var docRef = app.activeDocument;
    var artboard = docRef.artboards.getByName(name);
    for (i = 0; i < docRef.artboards.length; i++) {
        if (docRef.artboards[i] == artboard) {
            docRef.artboards.setActiveArtboardIndex(i);
            break;
        }
    }
}

function GetNumSublayer(layer, layersub)
{
    var idoc = app.activeDocument;  
    var ilayer = idoc.activeLayer;  
	    for (i=0; i<ilayer.layers.length; i++) { 
		// какая-то хуйня. то кидал ошибку, то с этими алертами пошел, не показывая алертов.
        //alert(sublayer.pageItems[i]);	
		//alert(sublayer.pageItems[i].name);
        var sublayer = ilayer.layers[i];  
		//alert(sublayer.pageItems[0].name);
	////if(isEmpty(sublayer.pageItems[0].name))continue;

		//if(!sublayer.pageItems[0])continue;
		//if(!sublayer.pageItems[0].name)continue;
		try{
			if(isEmpty(sublayer.pageItems[0].name))continue;
			
		}
		catch(error)
		{
			continue;
		}
		
	//	if(sublayer.pageItems[0].name =='')continue;
		alert(sublayer.pageItems[0].contents);
        sublayer.name = sublayer.pageItems[0].name || sublayer.pageItems[0].contents;  
    }
	
			var myLayer = app.activeDocument.layers[layer];
			for (i = 0; i < myLayer.layers.length; i++)
			{
				var mySublayer = myLayer.layers[i];
				if (mySublayer.name == layersub) 
				{
					//alert(mySublayer.name);
					return i;
				}
			}
}

function isEmpty(val)
{
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

//  *********************************************************************
//
//            Запись списка подслоев в файл из родительского слоя
//
//  *********************************************************************
function SublayersToCsv(sub,filepath)
{
  //var randomname = "layers";
  // get the textfile
  //  var filepath = "d:\\" + randomname + ".csv";
    var write_file = File(filepath);
    if (!write_file.exists) {
        // if the file does not exist create one
        write_file = new File(filepath);
    } else {
        // if it exists ask the user if it should be overwritten
        var res = confirm("The file already exists. Should I overwrite it", true, "titleWINonly");
        // if the user hits no stop the script
        if (res !== true) {
            return;
        }
    }
    var out; // our output
    // we know already that the file exist
    // but to be sure
    if (write_file !== '') {
        //Open the file for writing.
        out = write_file.open('w', undefined, undefined);
        write_file.encoding = "UTF-8";
        write_file.lineFeed = "Unix"; //convert to UNIX lineFeed
        // txtFile.lineFeed = "Windows";
        // txtFile.lineFeed = "Macintosh";
    }
    // got an output?
    if (out !== false) {
        // loop the list and write each item to the file
        for (var i = 0; i < sub.length; i++) {
            write_file.writeln(sub[i].name+';'+i);
        }
        // allways close files!
        write_file.close();
    }
 }


//  *********************************************************************
//
//           читаем csv и запихиваем текст в массив.
//
//  *********************************************************************
function Csv2Array(fileObj) {
    var fileArray, thisLine, csvArray;

	// // logger b
	// var logger = new File('c:\\work\\_mockups\\log_csv.txt');
	// logger.open("a");
	// logger.write('\n----',fileObj,' -----');
	// // logger e

    fileArray = [];
    fileObj.open('r');
    while (!fileObj.eof) {
        thisLine = fileObj.readln();
		
		if(thisLine.length > 0) {
        csvArray = thisLine.split(';');
        fileArray.push(csvArray);
		}
    };
    fileObj.close();
    var tmp_arr = new Array();
    for (var i = 0; i < fileArray.length; i++) {
        var data = new Array();
        data = fileArray[i].toString().split(','); // в массиве уже нет ";" он разделен ","
		tmp_arr[i] = data;// new Array(data);// new Array(data[0], data[1])
    }


	// logger b
	// logger.write( t,'\n' );
	// logger.close();
	// logger e
	return tmp_arr;
};


function Save2PdfNClose(doc,fn,out_file_type1)
{
// Create the illusrtratorSaveOptions object to set the AI options
        
		if(out_file_type1 == 'pdf')
		{
			var saveOpts = new IllustratorSaveOptions();
			
			var saveName = new File ( fn+".pdf" );
				// Setting IllustratorSaveOptions properties. 
				saveOpts.embedLinkedFiles = true;
				saveOpts.fontSubsetThreshold = 0.0
				saveOpts.pdfCompatible = true	  
				saveOpts = new PDFSaveOptions();
				saveOpts.compatibility = PDFCompatibility.ACROBAT5;
				saveOpts.generateThumbnails = true;
				saveOpts.preserveEditability = true;
			doc.saveAs( saveName, saveOpts );
			doc.close(SaveOptions.DONOTSAVECHANGES);
		}
		
		
		 if (out_file_type1 == 'png')
		{
			var saveName = new File ( fn+".png" );
			file = new File(saveName);
			var saveOpts = new ExportOptionsPNG24();
				saveOpts.antiAliasing = true;
				saveOpts.transparency = true;
				saveOpts.artBoardClipping = true;
				saveOpts.verticalScale = 600/doc.width*100;
				saveOpts.horizontalScale = 600/doc.width*100;
			
            doc.exportFile(file, ExportType.PNG24, saveOpts);
			doc.close(SaveOptions.DONOTSAVECHANGES);
			
		}
		
		if (out_file_type1 == 'jpg')
		{
			var saveName = new File ( fn+".jpg" );
			file = new File(saveName);
			var saveOpts = new ExportOptionsJPEG();
				saveOpts.antiAliasing = false;
				saveOpts.qualitySetting = 80;

				saveOpts.verticalScale = 600/doc.width*100;
				saveOpts.horizontalScale = 600/doc.width*100;
			
            doc.exportFile(file, ExportType.JPEG, saveOpts);
			doc.close(SaveOptions.DONOTSAVECHANGES);
			
		}
		
		
		
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function ToPdf() {
    var doc = app.activeDocument;
    if (documents.length > 0) {

        // Create the illusrtratorSaveOptions object to set the AI options
        var saveOpts = new IllustratorSaveOptions();

        // Setting IllustratorSaveOptions properties. 
        saveOpts.embedLinkedFiles = true;
        saveOpts.fontSubsetThreshold = 0.0
        saveOpts.pdfCompatible = true

        //  if (doc.saved==false) doc.save();

        //   for (i=0; i<doc.layers.length; i++)
        //       if (doc.layers[i].locked == false) doc.layers[i].visible = false;
        fullDocName = doc.fullName;
        var param = doc.name.split('.');
        realDocName = param[0];
        var ilayer = doc.activeLayer;

        /* var idoc = app.activeDocument;  
        var ilayer = idoc.activeLayer;  
        for (i=0; i<ilayer.layers.length; i++) {  
            var isublayer = ilayer.layers[i];  
            isublayer.name = isublayer.pageItems[0].name;  
        }   */

        //   var isublayer = ilayer.layers[i];		
        //alert(ilayer.name);
        var activeAB = doc.artboards[doc.artboards.getActiveArtboardIndex()]; // get active AB  
        var docLeft = activeAB.artboardRect[0];
        var docTop = activeAB.artboardRect[1];

        for (i = 0; i < ilayer.layers.length; i++) {
            /*             if (i-1<0) ilayer.layers[i].visible = true;
                        else {
                            ilayer.layers[i-1].visible = false;
                            ilayer.layers[i].visible = true;
                        } */
            if (ilayer.layers[i].locked == false && ilayer.layers[i].visible == false) {

                ilayer.layers[i].visible == true;

                var xx = [doc.selection.bounds[0].docLeft, doc.selection.bounds[1].docTop];

                alert(ilayer.layers[i].name + '<<>>' + xx.length);
                ilayer.layers[i].visible == false;
                // docName = realDocName+doc.layers[i].name+".pdf";    
                // var saveName = new File ( doc.path + "/" + docName );

                // saveOpts = new PDFSaveOptions();
                // saveOpts.compatibility = PDFCompatibility.ACROBAT5;
                // saveOpts.generateThumbnails = true;
                // saveOpts.preserveEditability = true;
                // doc.saveAs( saveName, saveOpts );
            }
        }
        // doc.close(SaveOptions.DONOTSAVECHANGES);
        // doc = null;
        // app.open (fullDocName);
    }
}
/////////End

//customAlert('Hello', 3, 'This is a test - Will close in 3 seconds')
//customAlert('Hello', 0, 'This is a test - Will not close automatically')

function customAlert(message, delaySeconds, title){
    title = title || 'Alert';
    var alertWindow = new Window('palette', title);
    var control_text = alertWindow.add('edittext', [0, 0, 500, 200], message, {multiline: true});
   
    if(delaySeconds == 0){
        var control_close = alertWindow.add('button', undefined, 'Close');       
        control_close.onClick = function(){
            if(alertWindow){
                alertWindow.hide();
            }
        };
    }
    alertWindow.show();
    alertWindow.update();
   
    if(delaySeconds > 0){
        $.sleep(delaySeconds * 1000);
        alertWindow.hide();
        alertWindow = null;
    }  
}