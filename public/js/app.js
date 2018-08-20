

class TimersDashboard extends React.Component {
    state = {
        timers: [
            {
                title: 'Practice squat',
                project: 'Gym Chores',
                id: uuid.v4(),
                elapsed: 5456099,
                runningSince: Date.now(),
            },
            {
                title: 'Bake squash',
                project: 'Kitchen Chores',
                id: uuid.v4(),
                elapsed: 1273998,
                runningSince: null,
            },
        ],
    };

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

    updateTimer = (attrs) = {
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

    deleteTimer = (attrs) => {
    this.setState({
        timers: this.state.timers.filter((timer) => {
            if (timer.id === attrs.id) {
                return false;
            } else {
                return true;
            }
        })
    })
    };


    render() {
    return (
        <div className='ui three column centered grid'>
            <div className='column'>
                <EditableTimerList
                    timers={this.state.timers}
                    updateTimer={this.updateTimer}
                    deleteTimer={this.deleteTimer}
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
                runningSince={timer.runningSince}
                updateTimer={this.props.updateTimer}
                deleteTimer={this.props.deleteTimer}
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

    deleteTimer = () => {
        this.setState()
    }

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
                    runningSince={this.props.runningSince}
                    editTimer={this.editTimer}
                    deleteTimer={this.deleteTimer}
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
                        <span className='right floated trash icon' onClick={this.props.deleteTimer}>
              <i className='trash icon' />
            </span>
                    </div>
                </div>
                <div className='ui bottom attached blue basic button'>
                    Start
                </div>
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
