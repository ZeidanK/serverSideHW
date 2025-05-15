// import jquery from 'jquery';
// // Ensure jQuery is globally available for DataTables UMD modules
// window.jQuery = jquery;
// window.$ = jquery;

// // These imports rely on the UMD builds attaching to window.jQuery
// import 'datatables.net';
// import 'datatables.net-bs5';

// Function to fetch user data from the mock API
async function fetchUsers() {
  try {
    // Use the correct relative path to the mock API
    const response = await fetch(
      "./mock-api.json",
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData = await response.json();
    // Adjust to new mock API structure
    if (
      responseData &&
      responseData.getUsers &&
      responseData.getUsers.status === "success"
    ) {
      return responseData.getUsers.data || [];
    }
    console.error(
      "Mock API response format is not as expected or getUsers call failed.",
    );
    return []; // Return empty array on error or unexpected format
  } catch (error) {
    console.error("Could not fetch user data:", error);
    return []; // Return empty array on error to prevent DataTable errors
  }
}

// Function to initialize the DataTable
function initializeDataTable(usersData) {
    const table = $('#usersTable').DataTable({
        data: usersData,
        columns: [
            { data: 'id' },
            { data: 'email' },
            { data: 'userName' },
            {
                data: null,
                render: function (data, type, row) {
                    return `${row.firstName} ${row.lastName}`;
                },
                title: 'Full Name',
            },
            {
                data: 'birthDate',
                render: function (data, type, row) {
                    return data ? new Date(data).toLocaleDateString() : 'N/A';
                },
            },
            {
                data: 'userRegisteredSince',
                render: function (data, type, row) {
                    return data ? new Date(data).toLocaleDateString() : 'N/A';
                },
            },
            {
                data: 'deletedAt',
                render: function (data, type, row) {
                    return data
                        ? '<span class="badge bg-danger">Inactive</span>'
                        : '<span class="badge bg-success">Active</span>';
                },
            },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    const isActive = !row.deletedAt;
                    const buttonText = isActive ? 'Deactivate' : 'Activate';
                    const buttonClass = isActive ? 'btn-warning' : 'btn-success';
                    return `<button class="btn btn-sm ${buttonClass} btn-toggle-status" onclick="toggleUserStatus(${row.id})">${buttonText}</button>`;
                },
            },
        ],
        responsive: true,
        initComplete: function () {
            // Apply the search for each column
            this.api()
                .columns()
                .every(function () {
                    const column = this;
                    $('input', column.header()).on('keyup change clear', function () {
                        if (column.search() !== this.value) {
                            column.search(this.value).draw();
                        }
                    });
                });
        },
    });
}

// Function to toggle user status (mock behavior)
window.toggleUserStatus = function (userId) {
  const table = $("#usersTable").DataTable();
  let userData;
  let rowIndex;

  // Find the row and its data
  table.rows((idx, data, node) => {
    if (data.id === userId) {
      userData = data; // This is a reference to the data object in DT's internal cache
      rowIndex = idx;
      return true; // Stop searching
    }
    return false;
  });

  if (userData) {
    // Toggle deletedAt status
    userData.deletedAt = userData.deletedAt ? null : new Date().toISOString();

    // Invalidate the cell to re-render based on new data, then redraw the row
    table.row(rowIndex).data(userData).invalidate().draw(false); // 'false' to maintain current page
  } else {
    console.error("User not found for toggling status:", userId);
  }
};

// Load data and initialize table when the document is ready
$(document).ready(async function () {
  const users = await fetchUsers();
  if (users.length > 0) {
    initializeDataTable(users);
  } else {
    // Optionally display a message in the table if no data is loaded
    $("#usersTable tbody").html(
      '<tr><td colspan="8" class="text-center">No user data available or failed to load.</td></tr>',
    );
  }
});
