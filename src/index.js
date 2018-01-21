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
import { database } from './Firebase'

const MyListItem = props => (
	<ListItem
		style={{ fontFamily: 'Kalam' }}
		rightIconButton={
			<IconButton>
				<Delete />
			</IconButton>
		}
	>
		{props.text}
	</ListItem>
)

class App extends React.Component {
	state = {
		content: '',
		id: '',
		tasks: []
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
							style={{ backgroundColor: 'darkred' }}
						/>
						<TextField
							multiLine={true}
							textareaStyle={{ padding: '5px' }}
							fullWidth={true}
							underlineFocusStyle={{ borderColor: 'darkred' }}
							style={{ fontFamily: 'Kalam' }}
							name={'myTextField'}
							id={'myTextField'}
							onChange={(e, value) => this.setState({
								content: value,
								id: Date.now()
							})}
						/>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<RaisedButton
								label="Dodaj zadanie!"
								buttonStyle={{ fontFamily: 'Kalam', backgroundColor: 'darkred' }}
								labelColor={'#fff'}
								onClick={() => {
									database.ref(`/${this.state.id}/`).set({ content: this.state.content })
								}}
							/>
						</div>
						<List>
							{
								this.state.tasks.map(task => (
									<MyListItem text={task.content} key={task.key} />
								))
							}
						</List>
					</Paper>
				</MuiThemeProvider>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'))
