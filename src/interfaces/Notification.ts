interface INotification {
	_id: string;
	type: 'post' | 'friend';
	title: string;
	body: string;
	read: boolean;
	user: string;
}

export default INotification;
