import React, { Component } from 'react';

class Units extends Component {
        constructor() {
                super();
                this.handleSubmit = this.handleSubmit.bind(this)

        }

        handleSubmit(event) {
                this.props.setRadiusUnit(this.refs.radius.value, this.refs.unit.value)
                event.preventDefault();
        }
        render() {
                return (<div>
                        <div className='row line'>
                                <form onSubmit={this.handleSubmit}>
                                        <div className='form-group'>
                                                <div className='input-group'>
                                                        <div className='input-group-addon'> Radius </div> <input type='text' className="form-control" ref='radius' />
                                                </div>
                                                <div className='input-group'>
                                                        <div className='input-group-addon'> Units</div>
                                                        <select ref='unit' className='form-control'>
                                                                <option value="mi">Miles</option>
                                                                <option value="km">Kilometers</option>
                                                                <option value="ft">Feet</option>
                                                                <option value="mt">Metres</option>
                                                                <option value="in">Inches</option>
                                                                <option value="yd">Yards</option>
                                                        </select>

                                                </div>
                                                <div className='text-center'>
                                                        <input className='btn btn-primary ' type='submit' value='Submit' />
                                                </div>
                                        </div>
                                </form>
                        </div>
                </div>)
        }
}

export default Units