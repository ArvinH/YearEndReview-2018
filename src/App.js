import React, { Component } from 'react';
import './App.css';

import CalendarComponent from './Calendar';
import WaffleComponent from './Waffle';
import LineComponent from './Line';
import { Grid, Row, Col, DropdownButton, MenuItem } from 'react-bootstrap';

// datasets
import English from './datasets/calendarData-English';
import Entertainment from './datasets/calendarData-Entertainment';
import Exercise from './datasets/calendarData-Exercise';
import HackDay from './datasets/calendarData-HackDay';
import SickRehabilitation from './datasets/calendarData-Sick-rehabilitation';
import Training from './datasets/calendarData-Training';
import Work from './datasets/calendarData-Work';
import Waffle2018 from './datasets/calendarData-Waffle-2018';
import Waffle2017 from './datasets/calendarData-Waffle-2017';

// datasets for line
import EnglishLine from './datasets/calendarData-Line-English';
import EntertainmentLine from './datasets/calendarData-Line-Entertainment';
import ExerciseLine from './datasets/calendarData-Line-Exercise';
import HackDayLine from './datasets/calendarData-Line-HackDay';
import SickRehabilitationLine from './datasets/calendarData-Line-SickRehabilitation';
import TrainingLine from './datasets/calendarData-Line-Training';
import WorkLine from './datasets/calendarData-Line-Work';

const dataSets = {
    English,
    Entertainment,
    Exercise,
    HackDay,
    SickRehabilitation,
    Training,
    Work
};

const dataSetsForLine = {
  English: EnglishLine,
  Entertainment: EntertainmentLine,
  Exercise: ExerciseLine,
  HackDay: HackDayLine,
  SickRehabilitation: SickRehabilitationLine,
  Training: TrainingLine,
  Work: WorkLine
};

const CategoryList = Object.keys(dataSets);

class App extends Component {
  state = { currentDataCategory: 'Work' }
  handleDropdown = (eventKey) => {
    this.setState({
      currentDataCategory: eventKey
    })
  }
  render() {
    const { currentDataCategory } = this.state;
    return (
      <div className="App">
        <h1>2018 Year End Review</h1>
        <div className="StackGroup">
          <Grid>
            <Row className="show-grid">
              <div className="CalendarGroup">
                  <DropdownButton id="CalendarGroup" title={currentDataCategory} onSelect={this.handleDropdown}>
                    {CategoryList.map(cateogry => {
                      const active = currentDataCategory === cateogry;
                      return <MenuItem key={cateogry} active={active} eventKey={cateogry}>{cateogry}</MenuItem>
                    })}
                  </DropdownButton>
                  <CalendarComponent data={dataSets[currentDataCategory]}/>
                </div>
            </Row>
            <Row>
              <div style={{height: '500px'}}>
                  <LineComponent data={dataSetsForLine[currentDataCategory]} />
              </div>
            </Row>
          </Grid>
        </div>
        <div className="WaffleGroup">
            <Grid>
              <Row className="show-grid">
                <Col md={6}>
                  <div style={{ height: '450px'}}>
                    <h2>2017</h2>
                    <WaffleComponent data={Waffle2017} />
                  </div>
                </Col>
                <Col md={6}>
                  <div style={{ height: '450px'}}>
                    <h2>2018</h2>
                    <WaffleComponent data={Waffle2018} />
                  </div>
                </Col>
              </Row>
            </Grid>
        </div>
      </div>
    );
  }
}

export default App;
