# _AI_export_layers_csv
Adobe Illustrator scripting. Exports layers to file.
*I don't have enough time to describe the script in detail. Later I will write how the script itself works. 

Written to export layouts created in Illustrator, arranged on separate artboards.
 
In my case there are sticker layouts arranged on artboards by layers. All layers are turned off (except auxiliary layers). 
The script finds a label in the rules file (`RulesTreatmentsLayers.csv`) by the code in the task file (`stask.csv`), turns on the layer, copies it to a new file and turns off the layer. 

The program outputs layers defined in the task file `stask.csv` on the basis of the file with layout arrangement rules `RulesTreatmentsLayers.csv`.
The program outputs layers available in `stask.csv` either in 1 file or each layer in a separate file.



#Contains

- `layer_export.js` - main script

- `RulesTreatmentsLayers.csv` - file with rules. All stickers are located in sub-layers that have a main layer. 
The main layer is the name of the section. For example: `GelPolishMain`, which contains stickers in sub-layers . In my case, each sub-layer has the name of the sticker article.
	columns: 
		LayerParent - name of main layer;
		Layer - name of sub-layer with sticker;
		art - code of sticker (mine is a product code), is used to search for a rule . Synchronized with the code in the `stask.csv` file;
		x1 - x coord of artboard (0);
		y1 - y coord of artboard (0);
		w  - width of artboard;
		h  - geight of artboard;
		ArtboardName - artboards name;
		fname - not used now (for perspective);
		sticker_folder  - not used now (for perspective)


- `stask.csv` - file with task (in my case task for print house). 
	columns:
		art -  - code of sticker (mine is a product code), is used to search for a rule . Synchronized with the code in the `RulesTreatmentsLayers.csv` file;
		qtty - quantity (write of sticker for ptinthouse);
		f1 - not used now (for perspective);
		f2 - not used now (for perspective);
	