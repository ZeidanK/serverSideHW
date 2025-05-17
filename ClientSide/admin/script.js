// import jquery from 'jquery';
// // Ensure jQuery is globally available for DataTables UMD modules
// window.jQuery = jquery;
// window.$ = jquery;

// // These imports rely on the UMD builds attaching to window.jQuery
// import 'datatables.net';
// import 'datatables.net-bs5';
function ajaxCall(method, api, data, successCB, errorCB) {
  $.ajax({
      type: method,
      url: api,
      data: data,
      cache: false,
      contentType: "application/json",
      dataType: "json",
      success: successCB,
      error: errorCB
  });
}
async function fetchUsers() {
  return new Promise((resolve, reject) => {
    ajaxCall("GET", "https://localhost:7026/api/Users", null,
      function (response) {
        console.log(response);
        resolve(response || []);
      },
      function (error) {
        console.error(error);
        reject(error);
      }
    );
  });
}

async function fetchUsers1() {
  ajaxCall("GET", "https://localhost:7026/api/Users",null,function(response) {
    console.log(response);
    return response || [];
  },function(error) {
    console.log(error);
  });
}
// Function to fetch user data from the mock API
async function fetchUsersOld() {
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
            { data: 'name' },
            
            {
                data: 'active',
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    const isActive = data;
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
console.log(userData);
console.log(JSON.stringify(userData));
  if (userData) {
    // Toggle active status
    ajaxCall(
      "PUT",
      `https://localhost:7026/api/Users/UpdateUserStatus`,
      JSON.stringify(userData),
      function (response) {
        console.log("User status updated successfully:", response);
        userData.active = !userData.active; // Update the local data
         // Invalidate the cell to re-render based on new data, then redraw the row
    table.row(rowIndex).data(userData).invalidate().draw(false); // 'false' to maintain current page
      },
      function (error) {
        console.error("Error updating user status:", error);
      },
    );

    // Invalidate the cell to re-render based on new data, then redraw the row
    table.row(rowIndex).data(userData).invalidate().draw(false); // 'false' to maintain current page
  } else {
    console.error("User not found for toggling status:", userId);
  }
}
// Function to toggle user status (mock behavior)
window.toggleUserStatusold = function (userId) {
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
  console.log(users);
  if (users.length > 0) {
    console.log("Users data loaded successfully.");
    initializeDataTable(users);
  } else {
    // Optionally display a message in the table if no data is loaded
    $("#usersTable tbody").html(
      '<tr><td colspan="8" class="text-center">No user data available or failed to load.</td></tr>',
    );
  }
});
