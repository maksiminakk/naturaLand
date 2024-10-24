(function($) {
	function setChecked(target) {
		var checked = $(target).find("input[type='checkbox']:checked").length;
		if (checked) {
			$(target).find('.form-control .checkselect__option:first').html('Выбрано: ' + checked);
		} else {
			$(target).find('.form-control .checkselect__option:first').html(' Выберете корм');
		}
	}
 
	$.fn.checkselect = function() {
		this.wrapInner('<ul class="checkselect-popup _hidden dropdown__list"></ul>');
		this.prepend(
			'<div class="checkselect-control">' +
				'<div class="form-control"><div class="checkselect__option dropdown__button input"></div></div>' +
				'<div class="checkselect-over"></div>' +
			'</div>'
		);	
 
		this.each(function(){
			setChecked(this);
		});		
		this.find('input[type="checkbox"]').click(function(){
			setChecked($(this).parents('.checkselect'));
		});
 
		this.parent().find('.checkselect-control').on('click', function(){
			$popup = $(this).next();
			$('.checkselect-popup').not($popup).addClass('_hidden');
			if ($popup.hasClass('_hidden')) {
                $popup.removeClass('_hidden');
				$(this).find('select').focus();
			} else {
				$popup.addClass('_hidden');
			}
		});
 
		$('html, body').on('click', function(e){
			if ($(e.target).closest('.checkselect').length == 0){
				$('.checkselect-popup').addClass('_hidden');
			}
		});
	};
})(jQuery);	
 
$('.checkselect').checkselect();