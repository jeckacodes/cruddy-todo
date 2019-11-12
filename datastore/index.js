const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, count)=>{
    fs.writeFile(`${exports.dataDir}/${count}.txt`, text, (err) => {
      if (err) {
        throw ('error writing new to-do');
      } else {
        var obj = {};
        obj.id = count;
        obj.text = text;
        callback(null, obj);
      }
    });
  });
  // save a text file in /data: filename is ID number, and todo item is the contents of the file
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  return fs.readdir(exports.dataDir, (err, files)=>{
    if (err) {
      throw ('error reading all');
    } else {
      callback(null, files.map((file)=>({id: file.substring(0, file.length - 4), text: file.substring(0, file.length - 4)})));
      return files;
    }
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  return fs.readFile(`${exports.dataDir}/${id}.txt`, (err, data)=>{
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var obj = {};
      obj.id = id;
      obj.text = String(data);
      callback(null, obj);
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  exports.readAll((err, textArray)=>{
    if (err) {
      callback(new Error('error updating'));
    } else {
      var found = false;
      for (var file of textArray) {
        if (file.id === id) {
          found = true;
          fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err, text)=>{
            if (err) {
              throw ('error updating text');
            } else {
              var obj = {};
              obj.id = id;
              obj.text = String(text);
              callback(null, obj);
            }
          });
          break;
        }
      }
      if (!found) {
        callback(new Error(`No item with id: ${id}`));
      }
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  exports.readAll((err, textArray) => {
    if (err) {
      callback(new Error('error deleting'));
    } else {
      var found = false;
      for (var file of textArray) {
        if (file.id === id) {
          found = true;
          fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
            callback(err);
          });
          break;
        }
      }
      if (!found) {
        callback(new Error(`No item with id: ${id}`));
      }
    }
  });

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
