function filterServices() {
  // ====================================================
  // Get the selected service type from the dropdown menu
  // ----------------------------------------------------
  const selectedService     = $('#bulk_authorize_option').val();
  const filteredServicesDiv = $('#filtered-services');
  
  // ======================================================
  // Filter the services based on the selected service type
  // ------------------------------------------------------
  const filteredServices = smServices.filter(service => {
    const serviceType = service.sm_type.toLowerCase();
    const statusType  = (service.status ?? "").toLowerCase();

    // =====================================================
    // Check if the service type matches the selected option
    // -----------------------------------------------------
    let isTypeMatch = false;
    if (selectedService === "active&created") {
      isTypeMatch = (serviceType === "facebook" || serviceType === "instagram");
    } else {
      isTypeMatch = statusType === selectedService.toLowerCase();
    }
    return isTypeMatch;
  });

  // ========================================
  // Clear the existing filtered services div
  // ----------------------------------------
  filteredServicesDiv.empty();

  if (filteredServices.length > 0) {
    // ========================================
    // Sort the filtered services by account_id
    // ----------------------------------------
    filteredServices.sort((a, b) => a.account_id - b.account_id);

    // ======================================
    // Create a table to display the services
    // --------------------------------------
    const table = $('<table></table>').addClass('unified-table');
    const thead = $('<thead></thead>');
    const headerRow = $('<tr></tr>').addClass('columns-header scroll-row sort-row');
    const headers = [
                              "Account ID", 
                              "Service ID", 
                              "Service Type", 
                              "Social Media Name", 
                              "SM Account ID", 
                              "Updated At", 
                              "Health Status"
                             ];

    headers.forEach(text => {
      const th = $('<th></th>').addClass('skip-sort').text(text);
      headerRow.append(th);
    });

    thead.append(headerRow);
    table.append(thead);

    // =================
    // Create table body
    // -----------------
    const tbody = $('<tbody></tbody>');

    filteredServices.forEach(service => {
      const row = $('<tr></tr>');
      const updatedAt = new Date(service.updated_at);
      const year = updatedAt.getFullYear();
      const month = String(updatedAt.getMonth() + 1).padStart(2, "0");
      const date = String(updatedAt.getDate()).padStart(2, "0");
      const formattedUpdatedDate = `${year}-${month}-${date}`;
      
      const rowData = [
                              `<a href='/accounts/${service.account_id}'>${service.account_id}</a>`,
                              `<a href='/accounts/${service.account_id}/sm_services/social_media'>${service.id}</a>`,
                              `<i class="${getIconClass(service.sm_type)}"></i> ${service.sm_type}`,
                              "Awaiting Authentication",
                              service.remote_page_id,
                              formattedUpdatedDate
                             ];

      // ==================================================
      // Check the health_status and set the text and color
      // --------------------------------------------------
      let healthStatusText = service.health_status;
      let healthStatusColor = "red";
      if (healthStatusText === null) {
        if (service.access_token) {
          healthStatusText  = "Authenticated";
          healthStatusColor = "green";
        } else {
          healthStatusText  = "Needs Authentication";
          healthStatusColor = "darkorange";
        }
      }
      rowData.push(healthStatusText);

      // =========================================================
      // Update the sm_account_name row with the URL if applicable
      // ---------------------------------------------------------
      if (service.sm_account_name) {
        let url;
        if (service.sm_type.toLowerCase() === 'instagram') {
          url = `https://www.instagram.com/${service.sm_account_name}`;
        } else {
          url = `https://www.facebook.com/${service.remote_page_id}`;
        }
        rowData[3] = `<a href='${url}' target='_blank'>${service.sm_account_name}</a>`;
      }

      rowData.forEach((text, index) => {
        const td = $('<td></td>');
        // =================================================
        // For Account ID, Service ID, Service Type and Name
        // -------------------------------------------------
        if (index === 0 || index === 1 || index === 2 || index === 3) {
          td.html(text);
        } else {
          td.text(text);
        }
        if (index === rowData.length - 1) {
          td.css('color', healthStatusColor);
        }
        // =======================================================
        // If sm_account_name row is null, set the color to orange
        // -------------------------------------------------------
        if (index === 3 && text === "Awaiting Authentication") {
          td.css('color', 'darkorange');
        }
        row.append(td);
      });

      tbody.append(row);
    });

    table.append(tbody);
    filteredServicesDiv.append(table);
  } else {
    // ======================================
    // Display a message if no services found
    // --------------------------------------
    const h2Element = $('<h2></h2>').text("No Services Selected").css('text-align', 'center');
    filteredServicesDiv.append(h2Element);
  }

  // ===========================================================
  // Update the hidden input field with the filtered service IDs
  // -----------------------------------------------------------
  const filteredServiceIds = filteredServices.map(service => service.id);
  $('#filtered_sm_services').val(JSON.stringify(filteredServiceIds));

  // ==========================================================
  // Show or hide the "Authorize Batch" button based on whether
  // filteredServiceIds are present
  // ----------------------------------------------------------
  const authorizeBatchButton = $('#authorize-batch-button');
  if (filteredServiceIds.length > 0) {
    authorizeBatchButton.removeClass('hidden');
  } else {
    authorizeBatchButton.addClass('hidden');
  }
}

function getIconClass(smType) {
  switch (smType) {
    case 'Facebook':
      return 'fa-brands fa-square-facebook';
    case 'Instagram':
      return 'fa-brands fa-square-instagram';
    default:
      return '';
  }
}

$(document).ready(function() {
  const bulkAuthorizeOption  = $("#bulk_authorize_option");
  const authorizeBatchButton = $("#authorize-batch-button");
  //######################
  //## Call Main Method ##
  //######################
  filterServices();
  
  // ==================================
  // Listen for changes on the dropdown
  // ----------------------------------
  if (bulkAuthorizeOption.length) {
    bulkAuthorizeOption.change(function() {
      filterServices();
    });
  } else {
    console.error("Element with ID 'bulk_authorize_option' not found.");
  }
  
  // ==========================================
  // Listen for click event on authorize button
  // ------------------------------------------
  if (authorizeBatchButton.length) {
    authorizeBatchButton.click(function(e) {
      e.preventDefault();
      $("#authorize-form").submit(); // Submit the form
    });
  } else {
    console.error("Element with ID 'authorize-batch-button' not found.");
  }
});
