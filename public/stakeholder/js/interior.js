$(document).ready(function() {
    // Handle the table setup form submission
    $('#table-setup-form').submit(function(e) {
        e.preventDefault();

        const tableCount = $('#table-count').val();
        const tableTypes = [];
        
        $('input[type="checkbox"]:checked').each(function() {
            tableTypes.push($(this).val());
        });

        if (tableCount && tableTypes.length > 0) {
            alert('Table setup saved successfully!');
        } else {
            alert('Please fill in all details.');
        }
    });

    // Handle image upload form submission
    $('#image-upload-form').submit(function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        $.ajax({
            url: '/upload-interior', // Replace with your API endpoint
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                alert('Image uploaded successfully!');
            },
            error: function() {
                alert('Image upload failed. Please try again.');
            }
        });
    });

    // Simulate loading a 3D Street View
    $('#load-3d').click(function() {
        $('#street-view').html('<div>3D View Loading...</div>');
        setTimeout(function() {
            $('#street-view').html('<div><strong>3D Street View Loaded</strong></div>');
        }, 2000);
    });
});
