const fs = require('fs');
const English = require('./datasets/calendarData-English');
const Entertainment = require('./datasets/calendarData-Entertainment');
const Exercise = require('./datasets/calendarData-Exercise');
const HackDay = require('./datasets/calendarData-HackDay');
const SickRehabilitation = require('./datasets/calendarData-Sick-rehabilitation');
const Training = require('./datasets/calendarData-Training');
const Work = require('./datasets/calendarData-Work');

const DataSetMap = {
  English,
  Entertainment,
  Exercise,
  HackDay,
  SickRehabilitation,
  Training,
  Work
};

Object.keys(DataSetMap).forEach(key => {
  const dataNeedHandle = DataSetMap[key];
  const NewDataAggregate = dataNeedHandle.reduce((acc, data) => {
    const date = data.day;
    const [year, month, day] = date.split('-');
    acc[`${year}-${month}`] = (acc[`${year}-${month}`] || 0) + data.value;
    return acc;
  }, {});
  
  const NewData2017Result = {
    id: 2017,
    color: "#E8C0A0",
    data: []
  };
  const NewData2018Result = {
    id: 2018,
    color: "#F47560",
    data: []
  };
  Object.keys(NewDataAggregate).forEach(key => {
    const [year, month] = key.split('-');
    const data = {
      x: month,
      y: NewDataAggregate[key]
    };
    if (year === '2017') {
      NewData2017Result.data.push(data);
    } else if (year === '2018') {
      NewData2018Result.data.push(data);
    }
  });
  
  fs.appendFile(`./datasets/calendarData-Line-${key}.js`, `export default ${JSON.stringify([NewData2018Result, NewData2017Result], null, 2)}`, 'utf8', (err) => {
    if (err) throw err;
  });
});