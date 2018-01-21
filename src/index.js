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
import { lightBlue900 } from 'material-ui/styles/colors'
import { database } from './Firebase'

const MyListItem = props => (
	<ListItem
		style={
			props.done ?
				{ fontFamily: 'Kalam', textDecoration: 'line-through', color: '#aaa' }
				:
				{ fontFamily: 'Kalam' }
		}
		onClick={() => database.ref(`/${props.id}/`).update({
			done: !props.done
		})}
		rightIconButton={
			<IconButton
				iconStyle={{ color: lightBlue900, iconHoverColor: 'black' }}
				onClick={() => database.ref(`/${props.id}/`).remove()}
			>
				<Delete />
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
		value: 0
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
						tasks: Object.values(tasksArray)
					}
				)
			})
	}

	render() {
		return (
			<div>
				<MuiThemeProvider>
					<Paper style={{ width: '50vw', margin: '20px' }}>
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
							name={'myTextField'}
							id={'myTextField'}
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
								onClick={() => {
									this.state.content ? (
										database.ref(`/${this.state.id}/`)
											.set({
												content: this.state.content,
												done: this.state.done
											})
									)
										:
										alert('You cannot add empty task!')
								}}
							/>
						</div>
						<List>
							{
								let tasksToDisplay = this.state.value === 0 ?
								this.state.tasks
								:
								this.state.tasks.value === 1?
									this.state.tasks.filter((task)=>{task.done === true})
									:
									this.state.tasks.filter((task)=>{task.done === true})

									tasksToDisplay(task => (
										<MyListItem
								key={task.key}
								text={task.content}
								id={task.key}
								done={task.done}
							/>
							))
							}
						</List>
						<Divider />
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<SelectField
								style={{ fontFamily: 'Kalam' }}
								menuItemStyle={{ fontFamily: 'Kalam' }}
								floatingLabelText={'Display'}
								floatingLabelFixed={true}
								listStyle={{ color: 'orange' }}
								value={this.state.value}
								onChange={(e, v) => this.setState({ value: v })}
								selectedMenuItemStyle={{ color: lightBlue900 }}
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
									primaryText="Not done"
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
