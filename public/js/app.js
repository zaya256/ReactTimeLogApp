

class TimersDashboard extends React.Component {
    state = {
        timers: [
            {
                title: 'Practice squat',
                project: 'Gym Chores',
                id: uuid.v4(),
                elapsed: 5456099,
                hasTimerStarted: false,
                runningSince: Date.now(),
            },
            {
                title: 'Bake squash',
                project: 'Kitchen Chores',
                id: uuid.v4(),
                elapsed: 1273998,
                hasTimerStarted: false,
                runningSince: null,
            },
        ],
        intervalIds: []
    };

    // [
    //     { intervalId: 12, timerID: 'ii'}
    // ]

    // Inside TimersDashboard
    handleCreateFormSubmit = (timer) => {
        this.createTimer(timer);
    };

    createTimer = (timer) => {
        const t = helpers.newTimer(timer);
        this.setState({
            timers: this.state.timers.concat(t),
        });
    };

    updateTimer = (attrs) => {
        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === attrs.id) {
                    return Object.assign({}, timer, {title: attrs.title, project: attrs.project});
                } else {
                    return timer
                }
            })

        }
    )
    };

    deleteTimer = (timerId) => {
        // console.log(timerId);
        console.log(this.state.timers, "BEFORE")
        const timers = this.state.timers.filter((timer) => {
            if (timer.id === timerId) {
                return false;
            } else {
                return true;
            }
        });

        console.log(timers, "AFTER");

        this.setState({
            timers: timers,
        })
    };

    stopTimer = (timerId) => {
        console.log(timerId);
        // remove intervalId and clear it
        const intervalIds = this.state.intervalIds.filter((interval) => {
            if (interval.timerId === timerId) {
                clearInterval(interval.intervalId);
                return false;
            } else {
                return true;
            }
        });

        // set timer.hasTImerStarted to false
        const timers = this.state.timers.map((timer) => {
            // get the particular timer
            // and change timer.hasTImerStarted to false
            if (timer.id === timerId) {
                // if(timer.hasTimerStarted) {
                    timer.hasTimerStarted = false;
                    return timer
                //}
            } else {
                return timer;
            }

        });
        // console.log(timers, "AFTER");
        // this.stopTimer(timerId);
        // timer.hasTimerStarted = false;
        // return timer;

        // update the state with the then timers and intervalId
        this.setState({
            intervalIds: intervalIds,
            timers: timers
        })
    };

    startTimer = (timerId) => {
        console.log(timerId);
        // [timer, timer]
        // timer[id].elapsed -= 1

        // 1. create an interval of 1second
        // 2. add the invertalId and timerId to the state
        // 3. update time elapsed

        const intervalId = setInterval(() => {
            const timers = this.state.timers.map((timer) => {
                if (timer.id === timerId) {
                    // console.log(helpers.renderElapsedString(timer.elapsed), "BEFORE");
                    //1. subtract 1s fromelapsed time
                    //2. if the timer.hasTimerStarted is false set to true

                    const newElapsed = (timer.elapsed/1000 -1) * 1000;
                    if(!timer.hasTimerStarted) {
                        timer.hasTimerStarted = true;
                    }

                    timer.elapsed = newElapsed;
                    // console.log(helpers.renderElapsedString(newElapsed), "AFTER");
                    return timer;
                } else {
                    return timer
                }
            });
            this.setState({ timers: timers })
        }, 1000);

        this.setState((prevState) => {
            const intervalIds = [...prevState.intervalIds,  {
                intervalId: intervalId, timerId: timerId
            }]

            return {
                intervalIds: intervalIds
            }
        });

        //console.log(intervalId)
        // const timers = this.state.timers.map((timer) => {
        //     if (timer.id === timerId) {
        //         console.log(helpers.renderElapsedString(timer), "BEFORE");
        //         const newTime = (timer.elapsed/1000 -1) * 1000;
        //         console.log(helpers.renderElapsedString(newTime), "AFTER");
        //     } else {
        //         return timer
        //     }
        // })
        //
        // const timers = this.state.timers.filter((timer) => {
        //     if (timer.id === timerId) {
        //         return false;
        //     } else {
        //         return true;
        //     }
        // });
    };

    render() {
    return (
        <div className='ui three column centered grid'>
            <div className='column'>
                <EditableTimerList
                    timers={this.state.timers}
                    updateTimer={this.updateTimer}
                    deleteTimer={this.deleteTimer}
                    startTimer={this.startTimer}
                    stopTimer={this.stopTimer}
                />
                <ToggleableTimerForm
                    onFormSubmit={this.handleCreateFormSubmit}
                />
            </div>
        </div>
    );
}

}



// let start = (this.state.time == 0) ?
//     <button onClick={this.startTimer}>start</button> :
//     null
// let stop = (this.state.time == 0 || !this.state.isOn) ?
//     null :
//     <button onClick={this.stopTimer}>stop</button>
// let resume = (this.state.time == 0 || this.state.isOn) ?
//     null :
//     <button onClick={this.startTimer}>resume</button>
// let reset = (this.state.time == 0 || this.state.isOn) ?
//     null :
//     <button onClick={this.resetTimer}>reset</button>



class ToggleableTimerForm extends React.Component {
    state = {
        isOpen: false,
    };

    // Inside ToggleableTimerForm
    handleFormOpen = () => {
        this.setState({ isOpen: true });
    };

    handleFormClose = () => {
        this.setState({ isOpen: false });
    };

    handleFormSubmit = (timer) => {
        this.props.onFormSubmit(timer);
        this.setState({ isOpen: false });
    };

    render() {
        if (this.state.isOpen) {
            return (
                <TimerForm
                    onFormSubmit={this.handleFormSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        } else {
            return (
                <div className='ui basic content center aligned segment'>
                    <button
                        className='ui basic button icon'
                        onClick={this.handleFormOpen}
                    >
                        <i className='plus icon' />
                    </button>
                </div>
            );
        }
    }
}

class EditableTimerList extends React.Component {
    render() {
        const timers = this.props.timers.map((timer) => (
            <EditableTimer
                key={timer.id}
                id={timer.id}
                title={timer.title}
                project={timer.project}
                elapsed={timer.elapsed}
                hasTimerStarted={timer.hasTimerStarted}
                runningSince={timer.runningSince}
                updateTimer={this.props.updateTimer}
                deleteTimer={this.props.deleteTimer}
                startTimer={this.props.startTimer}
                stopTimer={this.props.stopTimer}
            />
        ));
        return (
            <div id='timers'>
                {timers}
            </div>
        );
    }
}

class EditableTimer extends React.Component {
    state = {
        editFormOpen: false,
    };

    editTimer = () => {
        this.setState({editFormOpen: true})
    };
    onFormClose = () => {
        this.setState({editFormOpen: false})

    };

    render() {
        if (this.state.editFormOpen) {
            return (
                <TimerForm
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    onFormClose={this.onFormClose}
                    onFormSubmit={this.props.updateTimer}
                />
            );
        } else {
            return (
                <Timer
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    hasTimerStarted={this.props.hasTimerStarted}
                    runningSince={this.props.runningSince}
                    editTimer={this.editTimer}
                    deleteTimer={this.props.deleteTimer}
                    startTimer={this.props.startTimer}
                    stopTimer={this.props.stopTimer}
                />
            );
        }
    }
}

class Timer extends React.Component {
    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed);
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='header'>
                        {this.props.title}
                    </div>
                    <div className='meta'>
                        {this.props.project}
                    </div>
                    <div className='center aligned description'>
                        <h2>
                            {elapsedString}
                        </h2>
                    </div>
                    <div className='extra content'>
            <span className='right floated edit icon' onClick={this.props.editTimer}>>
              <i className='edit icon' />
            </span>
                        <span className='right floated trash icon' onClick={() => this.props.deleteTimer(this.props.id)}>
                            <i className='trash icon' />
                        </span>
                    </div>
                </div>
                <button className='ui bottom attached blue basic button' onClick={() => {
                    if (this.props.hasTimerStarted) {
                        this.props.stopTimer(this.props.id)
                    } else {
                        this.props.startTimer(this.props.id)
                    }
                }}>
                    {this.props.hasTimerStarted ? 'Stop' : 'Start'}
                </button>
            </div>
        );
    }
}

class TimerForm extends React.Component {
    state = {
        title: this.props.title || '',
        project: this.props.project || '',
    };

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value });
    };

    handleProjectChange = (e) => {
        this.setState({ project: e.target.value });
    };

    handleSubmit = () => {
        this.props.onFormSubmit({
            id: this.props.id,
            title: this.state.title,
            project: this.state.project,
        });

        this.props.handleFormClose()
    };

    render() {
        const submitText = this.props.id ? 'Update' : 'Create';
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input
                                type='text'
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                            />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input
                                type='text'
                                value={this.state.project}
                                onChange={this.handleProjectChange}
                            />
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button
                                className='ui basic blue button'
                                onClick={this.handleSubmit}
                            >
                                {submitText}
                            </button>
                            <button
                                className='ui basic red button'
                                onClick={this.props.onFormClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <TimersDashboard />,
    document.getElementById('content')
);
