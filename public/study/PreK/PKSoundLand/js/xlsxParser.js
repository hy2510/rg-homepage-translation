/*
    Relies on jQuery, underscore.js, Async.js (https://github.com/caolan/async), and zip.js (http://gildas-lormeau.github.com/zip.js).
    Tested only in Chrome on OS X.

    Call xlsxParser.parse(file) where file is an instance of File. For example (untested):

    document.ondrop = function(e) {
        var file = e.dataTransfer.files[0];
        excelParser.parse(file).then(function(data) {
            console.log(data);
        }, function(err) {
            console.log('error', err);
        });
    }
*/

xlsxParser = (function() {
	function extractFiles(file) {
		var deferred = $.Deferred();

		zip.createReader(new zip.BlobReader(file), function(reader) {
			reader.getEntries(function(entries) {
				async.reduce(entries, {}, function(memo, entry, done) {
					var files = ['xl/worksheets/sheet1.xml', 'xl/sharedStrings.xml'];
					if (files.indexOf(entry.filename) == -1) return done(null, memo);

					entry.getData(new zip.TextWriter(), function(data) {
						memo[entry.filename.split('/').pop()] = data;
						done(null, memo);
					});
				}, function(err, files) {
					if (err) deferred.reject(err);
					else deferred.resolve(files);
				});
			});
		}, function(error) { deferred.reject(error); });

		return deferred.promise();
	}

	function extractData(files) {
		var sheet = $(files['sheet1.xml']),
			strings = $(files['sharedStrings.xml']),
			data = [];

		var colToInt = function(col) {
			var letters = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
			var col = $.trim(col).split('');
			
			var n = 0;

			for (var i = 0; i < col.length; i++) {
				n *= 26;
				n += letters.indexOf(col[i]);
			}

			return n;
		};

		var Cell = function(cell) {
			cell = cell.split(/([0-9]+)/);
			this.row = parseInt(cell[1]);
			this.column = colToInt(cell[0]);
		};

		var d = sheet.find('dimension').attr('ref').split(':');
		d = _.map(d, function(v) { return new Cell(v); });

		var cols = d[1].column - d[0].column + 1,
			rows = d[1].row - d[0].row + 1;

		_(rows).times(function() {
			var _row = [];
			_(cols).times(function() { _row.push(''); });
			data.push(_row);
		});

		sheet.find('sheetData row c').each(function(i, c) {
			var $cell = $(c),
				cell = new Cell($cell.attr('r')),
				type = $cell.attr('t'),
				value = $cell.find('v').text();

			if (type == 's') value = strings.find('si t').eq(parseInt(value)).text();

			data[cell.row - d[0].row][cell.column - d[0].column] = value;
		});

		return data;
	}

	return {
		parse: function(file) {
			return extractFiles(file).pipe(function(files) {
				return extractData(files);
			});
		}
	}
})();