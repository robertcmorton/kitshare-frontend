
<div class="content-wrapper">
  <!-- Content Header (Page header) -->
  <section class="content-header">
    <h1> Edit Testimonial </h1>
    <ol class="breadcrumb">
      <li><a href="<?php echo base_url();?>home"><i class="fa fa-dashboard"></i> Dashboard</a></li>
      <li><a href="<?php echo base_url();?>testimonial">Testimonial List</a></li>
      <li class="active">Edit Testimonial</li>
    </ol>
  </section>
  <!-- Main content -->
  <section class="content">
  <div class="row">
    <div class="col-md-8">
      <!-- /.box -->
      <div class="box">
        <div class="box-header">
          <h3 class="box-title">Edit </h3>
        </div>
        <!-- /.box-header -->
        <div class="box-body pad">
        <form action="<?php echo base_url();?>testimonial/update_content" method="post" id="myFrm" enctype="multipart/form-data">
		<input type="hidden" name="testimonial_id" value="<?php echo $testimonial[0]->testimonial_id;?>" />
          
          <div class="row">
            <div class="col-sm-12" id="sample">
              <div class="form-group mbr" >
                <label for="exampleInputEmail1">Testimonial:</label>
		 <textarea name="testimonials_desc" id="testimonials_desc" placeholder="Testimonial"  rows="10" cols="80" class="form-control" required><?php echo $testimonial[0]->testimonials_desc ;?></textarea>

              </div>
            </div>
            <div class="clr"></div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label for="exampleInputEmail1">Status</label>
                <select class="form-control select2" name="status" id="status" style="width:100%;" >
                  <option value="Active" <?= ($testimonial[0]->status=='Y')?'selected="selected"':''?> >Active</option>
                  <option value="Inactive" <?= ($testimonial[0]->status=='N')?'selected="selected"':''?>>Inactive</option>
                </select> 
              </div>
            </div>
            <div class="clr"></div>
          </div>
          </div>
          <div class="box-footer">
            <button type="submit" class="btn btn-success">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /.col-->
</div>
<!-- ./row -->
</section>
<!-- /.content -->
</div>
