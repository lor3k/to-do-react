import ReactDOM from 'react-dom'
import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
import AppBar from 'material-ui/AppBar'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from 'material-ui/IconButton'
import { List, ListItem } from 'material-ui/List'
import Delete from 'material-ui/svg-icons/action/delete'
import Divider from 'material-ui/Divider'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { lightBlue900, red900 } from 'material-ui/styles/colors'
import { database } from './Firebase'



const MyListItem = props => (
	<ListItem
		style={
			(props.done && !props.filterType) ?
				{ fontFamily: 'Kalam', textDecoration: 'line-through', color: '#aaa' }
				:
				{ fontFamily: 'Kalam' }
		}
		onClick={() => database.ref(`/${props.id}/`).update({
			done: !props.done
		})}
		rightIconButton={
			<IconButton
				iconStyle={{ color: lightBlue900 }}
				onClick={() => database.ref(`/${props.id}/`).remove()}
			>
				<Delete hoverColor={red900} />
			</IconButton >
		}
	>
		{props.text}
	</ListItem >
)

class App extends React.Component {
	state = {
		content: '',
		id: '',
		done: false,
		tasks: [],
		filteredTasks: [],
		filterType: 0
	}

	componentWillMount() {
		database.ref()
			.on('value', snapshot => {
				let valuesArr = Object.entries(snapshot.val() || {})
				let tasksArray = valuesArr.map(([key, value]) => {
					value.key = key
					return value
				})
				this.setState(
					{
						tasks: Object.values(tasksArray),
						filteredTasks: Object.values(tasksArray)
					}
				)
			})
	}

	filterByStateOfDone = () => (
		this.state.filterType === 0 ?
			this.state.filteredTasks
			:
			this.state.filterType === 1 ?
				this.state.filteredTasks.filter(task => task.done === true)
				:
				this.state.filteredTasks.filter(task => task.done === false)
	)

	filterByName = (e, value) => {
		const polishSignsConversion = letter => {
			switch (letter) {
				case "ą": return "a"
				case "ć": return "c"
				case "ę": return "e"
				case "ł": return "l"
				case "ń": return "n"
				case "ó": return "o"
				case "ś": return "s"
				case "ź": return "z"
				case "ż": return "z"
				default: return letter
			}
		}
		const lowercaseEnglishSigns = word => (word.toLowerCase().split('').map(polishSignsConversion).join(''))
		this.setState({
			filteredTasks: this.state.tasks.filter(task => lowercaseEnglishSigns(task.content).indexOf(lowercaseEnglishSigns(value)) !== -1)
		})
	}

	setToDatabase = () => {
		if (this.state.content) {
			database.ref(`/${this.state.id}/`).set({
				content: this.state.content,
				done: this.state.done
			})
			this.setState({ content: '' })
		}
		else { alert('You cannot add empty task!') }
	}

	render() {
		return (
			<div>
				<MuiThemeProvider>
					<Paper className={'paper'}>
						<AppBar
							showMenuIconButton={false}
							title={'To Do List'}
							titleStyle={{ textAlign: 'center', fontFamily: 'Kalam' }}
							style={{ backgroundColor: lightBlue900 }}
						/>
						<TextField
							multiLine={true}
							textareaStyle={{ padding: '5px' }}
							fullWidth={true}
							underlineFocusStyle={{ borderColor: lightBlue900 }}
							style={{ fontFamily: 'Kalam' }}
							name={'input'}
							id={'input'}
							value={this.state.content}
							onChange={(e, value) => this.setState({
								content: value,
								id: Date.now(),
								done: false
							})}
						/>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<RaisedButton
								label="add task!"
								buttonStyle={{ fontFamily: 'Kalam', backgroundColor: lightBlue900 }}
								labelColor={'#fff'}
								onClick={this.setToDatabase}
							/>
						</div>
						<List>
							{
								this.filterByStateOfDone().map(task => (
									<MyListItem
										text={task.content}
										done={task.done}
										filterType={this.state.filterType}
										key={task.key}
										id={task.key}
									/>
								))
							}
						</List>
						<Divider />
						<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
							<TextField
								floatingLabelText="What are you looking for?"
								textareaStyle={{ padding: '5px' }}
								underlineFocusStyle={{ borderColor: lightBlue900 }}
								floatingLabelStyle={{ color: lightBlue900 }}
								style={{ fontFamily: 'Kalam' }}
								name={'lookingFor'}
								id={'lookingFor'}
								onChange={this.filterByName}
							/>
							<SelectField
								style={{ fontFamily: 'Kalam' }}
								menuItemStyle={{ fontFamily: 'Kalam' }}
								selectedMenuItemStyle={{ color: lightBlue900 }}
								floatingLabelText={'Display'}
								floatingLabelFixed={true}
								floatingLabelStyle={{ color: lightBlue900 }}
								underlineFocusStyle={{ borderColor: lightBlue900 }}
								value={this.state.filterType}
								onChange={(e, value) => this.setState({ filterType: value })}
							>
								<MenuItem
									value={0}
									primaryText="All"
								/>
								<MenuItem
									value={1}
									primaryText="Done"
								/>
								<MenuItem
									value={2}
									primaryText="To do"
								/>
							</SelectField>
						</div>
					</Paper>
				</MuiThemeProvider>
			</div >
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'))
