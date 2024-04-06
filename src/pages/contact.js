import React from 'react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
	Box,
	Table,
	styled,
	TableRow,
	TableBody,
	TableCell,
	TableHead,
	IconButton,
	TablePagination,
	InputBase,
	Paper,
	Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
	useDeleteContactMutation,
	useGetContactQuery,
} from 'src/services/contactApi';
import { Add, Delete, Edit } from '@mui/icons-material';
import ModalContact from '@/components/General/ModalContact';
import Loading from '@/components/General/Loading';

// STYLED COMPONENTS
const Container = styled('div')(({ theme }) => ({
	margin: '30px',
	[theme.breakpoints.down('sm')]: { margin: '16px' },
	'& .breadcrumb': {
		marginBottom: '30px',
		[theme.breakpoints.down('sm')]: { marginBottom: '16px' },
	},
}));

// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
	whiteSpace: 'pre',
	'& thead': {
		'& tr': { '& th': { paddingLeft: 0, paddingRight: 0 } },
	},
	'& tbody': {
		'& tr': { '& td': { paddingLeft: 0, textTransform: 'capitalize' } },
	},
}));

const Header = styled('div')(() => ({
	margin: '8px',
	paddingTop: '8px',
	display: 'flex',
	justifyContent: 'space-between',
	marginBottom: '20px',
}));

const Contact = () => {
	const [contractData, setContractData] = useState([]);
	const [page, setPage] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searchTerm, setSearchTerm] = useState('');

	const [deleteContract, { isSuccess, isError }] = useDeleteContactMutation();

	const { data: todos, isLoading, refetch } = useGetContactQuery();

	const handleChangePage = (_, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const [typeId, setTypeId] = useState({
		type: 'add',
		id: null,
	});

	const handleOpen = (typeModal, item) => {
		setTypeId((prev) => {
			return {
				...prev,
				type: typeModal,
				...item,
			};
		});
		setIsOpen((prev) => !prev);
	};

	const confirmDelete = (id) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!',
		}).then((result) => {
			if (result.isConfirmed) {
				deleteContract(id);
				if (isSuccess) {
					Swal.fire({
						title: 'Deleted!',
						text: 'Your file has been deleted.',
						icon: 'success',
					});
				} else if (isError) {
					Swal.fire({
						title: 'Error!',
						text: 'Your network error',
						icon: 'error',
					});
				}
			}
		});
	};

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const filteredData = contractData?.filter((item) =>
		item?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	useEffect(() => {
		setContractData(todos?.data);
	}, [todos]);

	return (
		<Container>
			<Header>
				<Paper
					sx={{
						p: '2px 4px',
						display: 'flex',
						alignItems: 'center',
						width: 400,
					}}
				>
					<InputBase
						sx={{ ml: 1, flex: 1 }}
						placeholder="Search..."
						inputProps={{ 'aria-label': 'search google maps' }}
						value={searchTerm}
						onChange={handleSearchChange}
					/>
					<IconButton type="button" sx={{ p: '10px' }} aria-label="search">
						<SearchIcon />
					</IconButton>
				</Paper>
				<Button
					color="primary"
					variant="outlined"
					onClick={() => handleOpen('add')}
				>
					<Add /> Add
				</Button>
			</Header>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<Box width="100%" overflow="auto">
						<StyledTable stickyHeader>
							<TableHead>
								<TableRow>
									<TableCell align="left">First Name</TableCell>
									<TableCell align="left">Last Name</TableCell>
									<TableCell align="left">Age</TableCell>
									<TableCell align="left">Photo</TableCell>
									<TableCell align="center">Action</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filteredData
									?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									?.map((employee, index) => (
										<TableRow key={index}>
											<TableCell align="left">{employee.firstName}</TableCell>
											<TableCell align="left">{employee.lastName}</TableCell>
											<TableCell align="left">{employee.age}</TableCell>
											<TableCell align="left">
												<img
													src={
														employee.photo ||
														'../assets/images/placeholder.jpeg'
													}
													width={50}
													height={50}
													alt="Uploaded photo"
													loading="lazy"
													placeholder={require('../assets/images/placeholder.jpeg')}
												/>
											</TableCell>
											<TableCell align="center">
												<IconButton
													color="primary"
													onClick={() => handleOpen('edit', employee)}
												>
													<Edit />
												</IconButton>
												<IconButton
													color="error"
													onClick={() => confirmDelete(employee.id)}
												>
													<Delete />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</StyledTable>

						<TablePagination
							sx={{ px: 2 }}
							page={page}
							component="div"
							rowsPerPage={rowsPerPage}
							count={contractData?.length}
							onPageChange={handleChangePage}
							rowsPerPageOptions={[5, 10, 25]}
							onRowsPerPageChange={handleChangeRowsPerPage}
							nextIconButtonProps={{ 'aria-label': 'Next Page' }}
							backIconButtonProps={{ 'aria-label': 'Previous Page' }}
						/>
					</Box>
				</>
			)}
			<ModalContact
				open={isOpen}
				onConfirmDialogClose={() => setIsOpen(false)}
				handleOpen={handleOpen}
				typeId={typeId}
				fetchData={refetch}
			/>
		</Container>
	);
};

export default Contact;
